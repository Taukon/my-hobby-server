import { Socket } from "socket.io-client";
import {
  createPeerConnection,
  setLocalOffer,
  setRemoteAnswer,
  setRemoteOffer,
} from "../peerConnection";
import { sendAppOfferSDPToDesktop } from "../signaling/desktop";
import { Access, AppSDP } from "../signaling/type";
import { sendAppAnswerSDPToBrowser } from "../signaling/browser";
import { timer } from "../util";

const waitTime = 2 * 1000;

type ScreenChartData = {
  name: string;
  lostRate: number;
};

export type ScreenStatistics = {
  desktopType: string;
  total: number;
  data: ScreenChartData[];
};

export class ScreenApp {
  private screenChannelConnection?: RTCPeerConnection;
  private screenDesktopChannel?: RTCDataChannel;
  private screenTrackConnection?: RTCPeerConnection;
  private screenBrowserChannels: {
    [browserId: string]: {
      connection: RTCPeerConnection;
      channel: RTCDataChannel;
      initialRecv: number;
      initialSend: number;
    };
  } = {};
  private screenBrowserTracks: { [browserId: string]: RTCPeerConnection } = {};

  private rtcConfigurationDesktop: RTCConfiguration;
  private rtcConfigurationBrowser: RTCConfiguration;
  private toDesktopSocket: Socket;
  private toBrowserSocket: Socket;

  private videoStream?: MediaStream;
  private videoTrack?: MediaStreamTrack;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public audio: any = document.createElement("audio");
  private audioTrack?: MediaStreamTrack;

  constructor(
    toDesktopSocket: Socket,
    toBrowserSocket: Socket,
    rtcConfigurationDesktop: RTCConfiguration,
    rtcConfigurationBrowser: RTCConfiguration,
  ) {
    this.toDesktopSocket = toDesktopSocket;
    this.toBrowserSocket = toBrowserSocket;
    this.rtcConfigurationDesktop = rtcConfigurationDesktop;
    this.rtcConfigurationBrowser = rtcConfigurationBrowser;
  }

  // https://www.w3.org/TR/webrtc-stats/#dom-rtcdatachannelstats-state
  private async getDesktopStatistics(): Promise<{
    recv?: number;
    type: string;
  }> {
    const stats = await this.screenChannelConnection?.getStats();

    if (stats) {
      let remoteCandidateId: string | undefined;
      let remoteCandidateType: string = "None";
      let totalRecv = 0;
      stats.forEach((report) => {
        if (report.type === "data-channel" && report.messagesReceived) {
          totalRecv = report.messagesReceived;
        } else if (report.type === "candidate-pair" && report.nominated) {
          remoteCandidateId = report.remoteCandidateId;
        } else if (
          report.type === "remote-candidate" &&
          remoteCandidateId === report.id
        ) {
          // console.log(`remote:${remoteCandidateId} | ${JSON.stringify(report)}`);
          remoteCandidateType = report.candidateType;
        }
      });

      switch (remoteCandidateType) {
        case "host":
          remoteCandidateType = "LAN内";
          break;
        case "srflx":
        case "prflx":
          remoteCandidateType = "ダイレクト";
          break;
        case "relay":
          remoteCandidateType = "リレー";
          break;
        default:
          break;
      }

      return {
        recv: totalRecv > 0 ? totalRecv : undefined,
        type: remoteCandidateType,
      };
    }

    return { type: "None" };
  }

  public async getScreenStatistics(): Promise<ScreenStatistics> {
    const result = await this.getDesktopStatistics();
    const totalRecv = result.recv;

    const chartData: ScreenChartData[] = [];
    if (totalRecv) {
      const dp = 1000;

      const lostList = Object.entries(this.screenBrowserChannels).map(
        async ([k, v]) => {
          const stats = await v.connection.getStats();
          let totalPerSec = 0;
          let sendPerSec = 0;
          stats.forEach((report) => {
            if (report.type === "data-channel" && report.messagesSent) {
              totalPerSec = totalRecv - v.initialRecv;
              sendPerSec = report.messagesSent - v.initialSend;
            }
          });

          v.initialRecv += totalPerSec;
          v.initialSend += sendPerSec;
          const lostPerSec = totalPerSec - sendPerSec;
          const lostRate =
            Math.floor((lostPerSec / totalPerSec) * 100 * dp) / dp;
          return { name: k, lostRate: lostRate };
        },
      );

      const channelCharts = await Promise.all(lostList);
      if (channelCharts.length > 0) {
        let sum = 0;
        for (const i of channelCharts) {
          sum += i.lostRate;
        }

        chartData.push({
          name: `total`,
          lostRate: Math.floor((sum / channelCharts.length) * dp) / dp,
        });
        chartData.push(...channelCharts);
      }
    }

    return {
      desktopType: result.type,
      total: chartData.length,
      data: chartData,
    };
  }

  // send Offer SDP to Desktop & send Answer SDP to Browser
  public async setChannel(
    access: Access,
    browserId: string,
    offerSdp: string,
  ): Promise<void> {
    if (this.screenChannelConnection?.connectionState !== "connected") {
      this.screenChannelConnection?.close();
      await this.reqScreenChannelToDesktop(this.toDesktopSocket, access);
      await timer(waitTime);
    }
    if (this.screenDesktopChannel?.readyState === "open")
      await this.resScreenChannelReqToBrowser(
        browserId,
        this.toBrowserSocket,
        offerSdp,
        this.screenDesktopChannel,
      );
  }

  // send Offer SDP to Desktop & send Answer SDP to Browser
  public async setTrack(
    access: Access,
    browserId: string,
    offerSdp: string,
  ): Promise<void> {
    if (this.screenTrackConnection?.connectionState !== "connected") {
      this.screenTrackConnection?.close();
      await this.reqScreenTrackToDesktop(this.toDesktopSocket, access);
      await timer(waitTime);
    }
    if (this.screenTrackConnection?.connectionState === "connected")
      await this.resScreenTrackReqToBrowser(
        browserId,
        this.toBrowserSocket,
        offerSdp,
      );
  }

  public async reqScreenChannelToDesktop(
    socket: Socket,
    access: Access,
  ): Promise<void> {
    const type = `screen`;
    const offerSDP = (sdp: string) =>
      sendAppOfferSDPToDesktop(socket, access, {
        type,
        sdp,
        appData: `channel`,
      });

    this.screenChannelConnection = createPeerConnection(
      offerSDP,
      this.rtcConfigurationDesktop,
    );
    const screenChannel = this.screenChannelConnection.createDataChannel(type, {
      ordered: false,
      maxRetransmits: 0,
    });

    screenChannel.onclose = () => {
      Object.values(this.screenBrowserChannels).forEach((v) => {
        v.channel.close();
      });
      delete this.screenChannelConnection;
      delete this.screenDesktopChannel;
    };

    screenChannel.onerror = () => {
      Object.values(this.screenBrowserChannels).forEach((v) => {
        v.channel.close();
      });
      delete this.screenChannelConnection;
      delete this.screenDesktopChannel;
    };

    screenChannel.onmessage = (event) => {
      Object.values(this.screenBrowserChannels).forEach((v) => {
        if (v.channel.readyState === "open" && v.channel.bufferedAmount === 0) {
          v.channel.send(event.data);
        }
      });
    };

    await setLocalOffer(this.screenChannelConnection);

    this.screenDesktopChannel = screenChannel;

    return;
  }

  public async reqScreenTrackToDesktop(
    socket: Socket,
    access: Access,
  ): Promise<void> {
    const type = `screen`;
    const offerSDP = (sdp: string) => {
      sendAppOfferSDPToDesktop(socket, access, { type, sdp, appData: `track` });
    };

    this.screenTrackConnection = createPeerConnection(
      offerSDP,
      this.rtcConfigurationDesktop,
    );

    this.screenTrackConnection.addTransceiver("video", {
      direction: "recvonly",
    });
    this.screenTrackConnection.addTransceiver("audio", {
      direction: "recvonly",
    });

    this.screenTrackConnection.ontrack = (event) => {
      console.log(
        `ontrack: ${event.track.kind} ${JSON.stringify(
          event.track.getSettings(),
        )}`,
      );
      if (event.track.kind === "video" && event.streams[0]) {
        this.videoTrack = event.track;
        this.videoStream = event.streams[0];
      } else if (event.track.kind === "audio" && event.streams[0]) {
        this.audioTrack = event.track;
        this.audio.srcObject = event.streams[0];
        this.audio.play();
      }
    };

    this.screenTrackConnection.onconnectionstatechange = () => {
      switch (this.screenTrackConnection?.connectionState) {
        case "connected":
          break;
        case "disconnected":
        case "failed":
        case "closed":
          this.screenTrackConnection.close();
          Object.values(this.screenBrowserTracks).forEach((v) => {
            v.close();
          });
          delete this.screenTrackConnection;
          break;
      }
    };

    await setLocalOffer(this.screenTrackConnection);

    return;
  }

  // listen Answer SDP
  public async setAnswerSDP(appSdp: AppSDP): Promise<boolean> {
    if (this.screenChannelConnection && appSdp.appData === `channel`) {
      await setRemoteAnswer(appSdp.sdp, this.screenChannelConnection);

      return true;
    } else if (this.screenTrackConnection && appSdp.appData === `track`) {
      await setRemoteAnswer(appSdp.sdp, this.screenTrackConnection);

      return true;
    }
    return false;
  }

  private async resScreenChannelReqToBrowser(
    browserId: string,
    socket: Socket,
    sdp: string,
    screenDesktopChannel: RTCDataChannel,
  ) {
    const answerSDP = (answerSDP: string) =>
      sendAppAnswerSDPToBrowser(socket, browserId, {
        type: `screen`,
        sdp: answerSDP,
        appData: `channel`,
      });

    const screenConnection = createPeerConnection(
      answerSDP,
      this.rtcConfigurationBrowser,
    );

    screenConnection.ondatachannel = (event: RTCDataChannelEvent) => {
      event.channel.onopen = async () => {
        const initial = await this.getDesktopStatistics();
        if (
          this.screenChannelConnection?.connectionState === "connected" &&
          initial.recv
        ) {
          this.screenBrowserChannels[browserId]?.channel.close();
          this.screenBrowserChannels[browserId]?.connection.close();
          this.screenBrowserChannels[browserId] = {
            connection: screenConnection,
            channel: event.channel,
            initialRecv: initial.recv,
            initialSend: 0,
          };
        } else {
          event.channel.close();
        }
      };

      event.channel.onclose = () => {
        event.channel.close();
        delete this.screenBrowserChannels[browserId];
      };

      event.channel.onerror = () => {
        event.channel.close();
        delete this.screenBrowserChannels[browserId];
      };

      event.channel.onmessage = (event) => {
        if (
          screenDesktopChannel.readyState === "open" &&
          screenDesktopChannel.bufferedAmount === 0
        ) {
          screenDesktopChannel.send(event.data);
        }
      };
    };

    await setRemoteOffer(sdp, screenConnection);
  }

  private async resScreenTrackReqToBrowser(
    browserId: string,
    socket: Socket,
    sdp: string,
  ) {
    const answerSDP = (answerSDP: string) =>
      sendAppAnswerSDPToBrowser(socket, browserId, {
        type: `screen`,
        sdp: answerSDP,
        appData: `track`,
      });

    const screenConnection = createPeerConnection(
      answerSDP,
      this.rtcConfigurationBrowser,
    );

    if (this.videoTrack && this.videoStream) {
      screenConnection.addTrack(this.videoTrack, this.videoStream);
    }

    if (this.audioTrack && this.audio.captureStream) {
      const stream = this.audio.captureStream();
      screenConnection.addTrack(this.audioTrack, stream);
    }

    this.screenBrowserTracks[browserId]?.close();
    this.screenBrowserTracks[browserId] = screenConnection;

    screenConnection.onconnectionstatechange = () => {
      switch (screenConnection.connectionState) {
        case "connected":
          if (!this.videoTrack && !this.audioTrack) {
            screenConnection.close();
          }
          break;
        case "disconnected":
        case "failed":
        case "closed":
          screenConnection.close();
          delete this.screenBrowserTracks[browserId];
          break;
      }
    };

    await setRemoteOffer(sdp, screenConnection);
  }
}
