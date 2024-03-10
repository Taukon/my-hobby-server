import { Socket } from "socket.io-client";
import { sendAppOfferSDP } from "../signaling";
import { Access, AppSDP } from "../signaling/type";
import { controlEventListener } from "../canvas";
import {
  createPeerConnection,
  setLocalOffer,
  setRemoteAnswer,
} from "../peerConnection";
import {
  appMaxId,
  appStatus,
  appendBuffer,
  createAppProtocol,
  getRandomInt,
  parseAppProtocol,
  parseEncodedFrame,
} from "../protocol";
import { timer } from "../util";

export class ShareApp {
  private rtcConfiguration: RTCConfiguration;
  private screenChannelConnection?: RTCPeerConnection;
  private screenTrackConnection?: RTCPeerConnection;

  private controlChannel?: RTCDataChannel;
  private controlConnection?: RTCPeerConnection;

  public desktopId: string;

  public canvas: HTMLCanvasElement;
  public audio: HTMLAudioElement;
  public screenWidth: number = 0;
  public screenHeight: number = 0;

  private controlAccept = true;
  public getControlAccept = () => {
    return this.controlAccept;
  };
  public setControlAccept = (accept: boolean) => {
    this.controlAccept = accept;
  };

  // screen
  private preId = 0;
  private order = 0;
  private tmp = new Uint8Array(0);
  private hasScreen = false;
  private hasFirstKey = false;
  private videoDecoder = new VideoDecoder({
    output: (frame) => {
      this.screenWidth = this.canvas.width = frame.displayWidth;
      this.screenHeight = this.canvas.height = frame.displayHeight;
      this.canvas.getContext("2d")?.drawImage(frame, 0, 0);
      frame.close();
    },
    error: (error) => {
      console.log(error);
    },
  });

  constructor(desktopId: string, rtcConfiguration: RTCConfiguration) {
    this.rtcConfiguration = rtcConfiguration;
    this.desktopId = desktopId;

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("tabindex", String(0));

    this.audio = document.createElement("audio");

    this.videoDecoder.configure({ codec: "vp8" });
  }

  public isChannelOpen(): boolean {
    return this.controlChannel?.readyState === "open";
  }

  public closeShareApp() {
    this.screenChannelConnection?.close();
    this.screenTrackConnection?.close();

    this.controlConnection?.close();
    this.controlChannel?.close();
  }

  // send Offer SDP
  public async reqShareApp(socket: Socket, access: Access): Promise<void> {
    await this.reqScreenTrack(socket, access);
    await this.reqScreenChannel(socket, access);
    await this.reqControl(socket, access);
  }

  // listen Answer SDP
  public async setShareApp(appSdp: AppSDP): Promise<void> {
    console.log(`answer sdp ${appSdp.type} : ${appSdp.appData}`);
    if (appSdp.type === `screen`) {
      await this.setScreen(appSdp);
    } else if (appSdp.type === `control`) {
      await this.setControl(appSdp.sdp);
    }
  }

  public async reqScreenChannel(socket: Socket, access: Access): Promise<void> {
    const type = `screen`;
    const offerSDP = (sdp: string) =>
      sendAppOfferSDP(socket, access, { type, sdp, appData: `channel` });

    this.screenChannelConnection = createPeerConnection(
      offerSDP,
      this.rtcConfiguration,
    );
    const screenChannel = this.screenChannelConnection.createDataChannel(type, {
      ordered: false,
      maxRetransmits: 0,
    });

    screenChannel.onopen = async () => {
      if (screenChannel.readyState === "open") {
        while (this.hasScreen === false) {
          const id = getRandomInt(appMaxId);
          const data = createAppProtocol(
            new Uint8Array(0),
            id,
            appStatus.start,
            0,
          );
          if (screenChannel.readyState === "open") screenChannel.send(data);
          await timer(2 * 1000);
        }
      }
    };

    screenChannel.onmessage = (event) => {
      if (!this.hasScreen) this.hasScreen = true;
      const buf = event.data;
      const parse = parseAppProtocol(new Uint8Array(buf));
      if (parse.status === appStatus.once) {
        const { keyFrame, data } = parseEncodedFrame(parse.data);
        if (keyFrame && !this.hasFirstKey) {
          this.hasFirstKey = true;
        }
        if (this.hasFirstKey) {
          const decodeChunk = new EncodedVideoChunk({
            type: keyFrame ? "key" : "delta",
            data: data,
            timestamp: 0,
            duration: 0,
          });
          this.videoDecoder.decode(decodeChunk);
        }
      } else if (parse.status === appStatus.start) {
        this.tmp = parse.data;
        this.preId = parse.id;
        this.order = parse.order + 1;
      } else if (
        parse.status === appStatus.middle &&
        parse.id === this.preId &&
        parse.order === this.order
      ) {
        this.tmp = appendBuffer(this.tmp, parse.data);
        this.order++;
      } else if (
        parse.status === appStatus.end &&
        parse.id === this.preId &&
        parse.order === this.order
      ) {
        this.tmp = appendBuffer(this.tmp, parse.data);

        const { keyFrame, data } = parseEncodedFrame(this.tmp);
        if (keyFrame && !this.hasFirstKey) {
          this.hasFirstKey = true;
        }
        if (this.hasFirstKey) {
          const decodeChunk = new EncodedVideoChunk({
            type: keyFrame ? "key" : "delta",
            data: data,
            timestamp: 0,
            duration: 0,
          });
          this.videoDecoder.decode(decodeChunk);
        }

        this.tmp = new Uint8Array(0);
        this.order = 0;
      } else {
        this.order = 0;
        this.tmp = new Uint8Array(0);
      }
    };

    await setLocalOffer(this.screenChannelConnection);

    return;
  }

  private async reqScreenTrack(socket: Socket, access: Access): Promise<void> {
    const type = `screen`;
    const offerSDP = (sdp: string) => {
      sendAppOfferSDP(socket, access, { type, sdp, appData: `track` });
    };

    this.screenTrackConnection = createPeerConnection(
      offerSDP,
      this.rtcConfiguration,
    );

    this.screenTrackConnection.addTransceiver("video", {
      direction: "recvonly",
    });
    this.screenTrackConnection.addTransceiver("audio", {
      direction: "recvonly",
    });

    this.screenTrackConnection.ontrack = (event) => {
      if (event.track.kind === "video" && event.streams[0]) {
        const video = document.createElement("video");
        video.srcObject = event.streams[0];
        video.onloadedmetadata = () => video.play();

        const loop = () => {
          if (
            this.screenWidth < video.videoWidth &&
            this.screenHeight < video.videoHeight
          ) {
            console.log(
              `canvas video: ${video.videoWidth} ${video.videoHeight}`,
            );
            this.screenWidth = video.videoWidth;
            this.screenHeight = video.videoHeight;
            this.canvas.style.width = `${video.videoWidth}px`;
            this.canvas.style.height = `${video.videoHeight}px`;
          }

          this.canvas.width = video.videoWidth;
          this.canvas.height = video.videoHeight;

          this.canvas.getContext("2d")?.drawImage(video, 0, 0);
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      } else if (event.track.kind === "audio" && event.streams[0]) {
        this.audio.srcObject = event.streams[0];
        this.audio.play();
      }
    };

    await setLocalOffer(this.screenTrackConnection);

    return;
  }

  // listen Answer SDP
  private async setScreen(appSdp: AppSDP): Promise<boolean> {
    if (this.screenChannelConnection && appSdp.appData === `channel`) {
      await setRemoteAnswer(appSdp.sdp, this.screenChannelConnection);
      return true;
    } else if (this.screenTrackConnection && appSdp.appData === `track`) {
      await setRemoteAnswer(appSdp.sdp, this.screenTrackConnection);
      return true;
    }
    return false;
  }

  private async reqControl(socket: Socket, access: Access): Promise<void> {
    const type = `control`;
    const offerSDP = (sdp: string) =>
      sendAppOfferSDP(socket, access, { type, sdp });

    this.controlConnection = createPeerConnection(
      offerSDP,
      this.rtcConfiguration,
    );
    this.controlChannel = this.controlConnection.createDataChannel(type, {
      ordered: true,
    });

    this.controlChannel.onopen = () => {
      if (this.controlChannel)
        controlEventListener(this, this.canvas, this.controlChannel);
    };

    await setLocalOffer(this.controlConnection);

    return;
  }

  // listen Answer SDP
  private async setControl(
    answerSdp: string,
  ): Promise<RTCDataChannel | undefined> {
    if (this.controlChannel && this.controlConnection) {
      await setRemoteAnswer(answerSdp, this.controlConnection);
      return this.controlChannel;
    }
    return undefined;
  }
}
