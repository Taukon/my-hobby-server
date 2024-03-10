import { Socket, io } from "socket.io-client";
import { RateInfo, Tick } from "./type";
import { timer } from "./util";

const dp = 10000;

export class ConnectionOCR {
  private serverAddress = `http://localhost:9000`;
  private socket?: Socket;
  private socketOption = {
    // secure: true,
    rejectUnauthorized: false,
    autoConnect: false, // necessary
  };

  constructor() {
    console.log(`create ConnectionOCR Instance`);
  }

  public getServerAddress() {
    return this.serverAddress;
  }

  public setServerAddress(address: string) {
    this.serverAddress = address;
  }

  private tick: Tick = { bid: 0, ask: 0, spread: 0 };
  private isCheck = false;

  public isConnected() {
    return this.socket ? this.socket.connected : false;
  }

  public connect() {
    if (this.socket == undefined) {
      this.socket = io(this.serverAddress, this.socketOption);
      this.socket.connect();
      this.socket.on("connect", () => {
        console.log(`connect: ${this.socket?.connected}`);
      });

      this.socket.emit("mode", "tick");

      this.socket.on("reqNow", (_, callback) => {
        callback(this.tick);
      });
    }
  }

  public setTick(bid: number, spread: number) {
    const ask = Math.floor((bid + spread) * dp) / dp;
    this.tick = { bid, ask, spread };
    // console.log(`tick: ${JSON.stringify(this.tick)}`);
  }

  public getIsloop() {
    return this.isCheck;
  }

  public stoploop() {
    this.isCheck = false;
  }

  public async loopSendRate() {
    console.log(`start loop`);

    const ms = 992;
    this.isCheck = true;

    let open = 0;
    let high = -1;
    let low = 10000;
    let startTime = Date.now();
    let count = 0;

    while (this.isCheck) {
      if (this.tick.bid == 0 && this.tick.spread == 0) {
        await timer(ms);
        continue;
      }

      const bid = this.tick.bid;
      const spread = this.tick.spread;

      if (open == 0) {
        open = bid;
      }

      if (bid > high) {
        high = bid;
      }

      if (bid < low) {
        low = bid;
      }

      count += 1;

      const millis = Date.now() - startTime;
      // if (5 - Math.floor(millis / 1000) < 1) {
      if (4800 < millis) {
        const rate: RateInfo = {
          open: open,
          high: high,
          low: low,
          close: bid,
          spread: spread,
          count: count,
          timestamp: Date.now(),
        };
        this.socket?.emit("rate", rate);
        // console.log(
        //   `o: ${rate.open} | h: ${rate.high} | l:${rate.low} | c:${rate.close} | s: ${rate.spread} | co: ${rate.count} | ${rate.timestamp}`,
        // );

        open = 0;
        high = -1;
        low = 10000;
        startTime = Date.now();
        count = 0;
        // console.log(`reset`);
      } else {
        await timer(ms);
      }
    }

    this.tick = { bid: 0, ask: 0, spread: 0 };
    console.log(`stop loop`);
  }
}
