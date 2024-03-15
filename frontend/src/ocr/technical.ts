import { Worker, createWorker } from "tesseract.js";
import { mouseClick } from ".";
import { AutoTrade } from "./autoTrade";
import { Position, Rectangle, Tick } from "./type";
import { timer } from "./util";

export type TCMType =
  | "sma200"
  | "sma325"
  | "bolS"
  | "bolAHigh"
  | "bolALow"
  | "bolBHigh"
  | "bolBLow";
type TCMValues = {
  sma200: number;
  sma325: number;
  bolS: number;
  bolAHigh: number;
  bolALow: number;
  bolBHigh: number;
  bolBLow: number;
};

const dp = 10000;

export class TechnicalChartMethod {
  private tcms: TCMValues = {
    sma200: NaN,
    sma325: NaN,
    bolS: NaN,
    bolAHigh: NaN,
    bolALow: NaN,
    bolBHigh: NaN,
    bolBLow: NaN,
  };

  public tcocr: TechnicalChartOCR;
  public tcat: AutoTrade;

  constructor(canvas: HTMLCanvasElement) {
    this.tcocr = new TechnicalChartOCR(canvas);
    this.tcat = new AutoTrade(canvas);
  }

  private tick: Tick = { bid: 0, ask: 0, spread: 0 };
  private isCheck = false;

  public setTick(bid: number, spread: number) {
    const ask = Math.floor((bid + spread) * dp) / dp;
    this.tick = { bid, ask, spread };
    // console.log(`tick: ${JSON.stringify(this.tick)}`);
  }

  private checkChartValues(): boolean {
    if (
      !Number.isNaN(this.tcms.sma200) &&
      !Number.isNaN(this.tcms.sma325) &&
      !Number.isNaN(this.tcms.bolS) &&
      !Number.isNaN(this.tcms.bolAHigh) &&
      !Number.isNaN(this.tcms.bolALow) &&
      !Number.isNaN(this.tcms.bolBHigh) &&
      !Number.isNaN(this.tcms.bolBLow)
    ) {
      return true;
    }
    return false;
  }

  public getIsLoop() {
    return this.isCheck;
  }

  public stopLoop() {
    this.isCheck = false;
  }

  public async loopAutoTrade() {
    console.log(`start loop`);

    const ms = 992;
    this.isCheck = true;

    let startTime = Date.now();

    while (this.isCheck) {
      if (this.tick.bid == 0 && this.tick.spread == 0) {
        await timer(ms);
        continue;
      }

      // --------------------
      if (!(await this.checkPosition(this.tick.bid, this.tick.spread))) {
        await this.logicOrder(this.tick.bid, this.tick.spread);
      }
      // --------------------

      const millis = Date.now() - startTime;
      // if (5 - Math.floor(millis / 1000) < 1) {
      if (4800 < millis) {
        await this.tcocr.clickChart();
        await this.tcocr.getValues((tcms) => {
          this.tcms = tcms;
        });

        startTime = Date.now();
      } else {
        await timer(ms);
      }
    }

    this.tick = { bid: 0, ask: 0, spread: 0 };
    console.log(`stop loop`);
  }

  private async checkPosition(bid: number, spread: number): Promise<boolean> {
    if (this.tcat.getOrderNow() == undefined) {
      return false;
    }

    if (this.tcat.isFixProfit() || this.tcat.isLossCut(bid, spread)) {
      await this.tcat.autoSettle();
    }

    return true;
  }

  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  public conf = {
    diffAB: 0.06,
    sizeA: 0.06,
    over: 0.03,
  };

  private async logicOrder(bid: number, spread: number) {
    if (!this.checkChartValues() || spread > 0.004) {
      return;
    }

    const { sma200, sma325, bolS, bolAHigh, bolALow, bolBHigh, bolBLow } =
      this.tcms;

    const { diffAB, sizeA, over } = this.conf;

    console.log(
      `low: ${bolAHigh - bolALow >= sizeA} ${sma200 > sma325} ${bolALow > sma325} ${bolS > sma200} |\n` +
        `high: ${bolAHigh - bolALow >= sizeA} ${sma325 > sma200} ${sma325 > bolAHigh} ${sma200 > bolS}`,
    );

    // low
    if (
      bolAHigh - bolALow >= sizeA &&
      sma200 > sma325 &&
      bolALow > sma325 &&
      bolS > sma200
    ) {
      if (bolALow > bid && bid > bolBLow && bolALow - bolBLow < diffAB) {
        console.log("-------low-long-------");
        await this.tcat.autoOrder("long", bolBLow - over);
      } else if (
        bolBHigh > bid &&
        bid > bolAHigh &&
        bolBHigh - bolAHigh < diffAB
      ) {
        console.log("-------low-short-------");
        await this.tcat.autoOrder("short", bolBHigh + over);
      }

      // high
    } else if (
      bolAHigh - bolALow >= sizeA &&
      sma325 > sma200 &&
      sma325 > bolAHigh &&
      sma200 > bolS
    ) {
      if (bolALow > bid && bid > bolBLow && bolALow - bolBLow < diffAB) {
        console.log("-------high-long-------");
        await this.tcat.autoOrder("long", bolBLow - over);
      } else if (
        bolBHigh > bid &&
        bid > bolAHigh &&
        bolBHigh - bolAHigh < diffAB
      ) {
        console.log("-------high-short-------");
        await this.tcat.autoOrder("short", bolBHigh + over);
      }
    }
  }

  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
  //   --------------------------------------------------------------------------
}

type TCMItem = {
  rect: Rectangle;
  ref: React.RefObject<HTMLDivElement>;
};

export class TechnicalChartOCR {
  private worker?: Worker;
  private canvas: HTMLCanvasElement;
  private sma200?: TCMItem;
  private sma325?: TCMItem;
  private bolS?: TCMItem;
  private bolAHigh?: TCMItem;
  private bolALow?: TCMItem;
  private bolBHigh?: TCMItem;
  private bolBLow?: TCMItem;
  private chartPos?: Position;

  public setUpdateChartPos(pos: Position) {
    if (pos.x < 0 || pos.y < 0 || Number.isNaN(pos.x) || Number.isNaN(pos.y)) {
      return;
    }
    this.chartPos = pos;
  }

  public async clickChart(ms?: number) {
    if (this.chartPos) {
      await mouseClick(true, this.canvas, this.chartPos);

      if (ms) await timer(ms);
    }
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public setChartValue(type: TCMType, item: TCMItem) {
    switch (type) {
      case "sma200":
        this.sma200 = item;
        break;
      case "sma325":
        this.sma325 = item;
        break;
      case "bolS":
        this.bolS = item;
        break;
      case "bolAHigh":
        this.bolAHigh = item;
        break;
      case "bolALow":
        this.bolALow = item;
        break;
      case "bolBHigh":
        this.bolBHigh = item;
        break;
      case "bolBLow":
        this.bolBLow = item;
        break;
      default:
        return;
    }
  }

  private async recognize(tcm: TCMItem): Promise<number> {
    if (!this.worker) {
      this.worker = await createWorker("eng");
    }

    try {
      const ret = await this.worker.recognize(this.canvas, {
        rectangle: tcm.rect,
      });
      const value = parseFloat(ret.data.text);

      const ctx = this.canvas.getContext("2d");
      ctx?.strokeRect(
        tcm.rect.left,
        tcm.rect.top,
        tcm.rect.width,
        tcm.rect.height,
      );
      if (tcm.ref.current) {
        tcm.ref.current.textContent = `${value}`;
      }

      return value;
    } catch (error) {
      console.log(error);
      await this.worker.terminate();
    }

    return NaN;
  }

  public async getValues(
    callback: (tcms: TCMValues) => void,
  ): Promise<boolean> {
    if (
      !(
        this.sma200 &&
        this.sma325 &&
        this.bolS &&
        this.bolAHigh &&
        this.bolALow &&
        this.bolBHigh &&
        this.bolBLow
      )
    ) {
      console.log(`failed. not set all rects.`);
      return false;
    }

    // const [sma200, sma325, bolS, bolAHigh, bolALow, bolBHigh, bolBLow] =
    //   await Promise.all([
    //     this.recognize(this.sma200),
    //     this.recognize(this.sma325),
    //     this.recognize(this.bolS),
    //     this.recognize(this.bolAHigh),
    //     this.recognize(this.bolALow),
    //     this.recognize(this.bolBHigh),
    //     this.recognize(this.bolBLow),
    //   ]);

    const sma200 = await this.recognize(this.sma200);
    const sma325 = await this.recognize(this.sma325);
    const bolS = await this.recognize(this.bolS);
    const bolAHigh = await this.recognize(this.bolAHigh);
    const bolALow = await this.recognize(this.bolALow);
    const bolBHigh = await this.recognize(this.bolBHigh);
    const bolBLow = await this.recognize(this.bolBLow);

    if (
      !Number.isNaN(sma200) &&
      !Number.isNaN(sma325) &&
      !Number.isNaN(bolS) &&
      !Number.isNaN(bolAHigh) &&
      !Number.isNaN(bolALow) &&
      !Number.isNaN(bolBHigh) &&
      !Number.isNaN(bolBLow)
    ) {
      callback({
        sma200,
        sma325,
        bolS,
        bolAHigh,
        bolALow,
        bolBHigh,
        bolBLow,
      });
      return true;
    }

    return false;
  }
}
