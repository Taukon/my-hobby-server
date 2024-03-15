import { Rectangle, Worker, createWorker } from "tesseract.js";
import { mouseClick } from ".";
import { Position } from "./type";
import { timer } from "./util";

type ATOrderType = "long" | "short" | "cross" | "";

export class AutoTrade {
  private orderNow: ATOrderType = "";
  // private bidPos = { x: 134, y: 359 };
  // private askPos = { x: 255, y: 359 };

  public left = true;
  public bidPos: Position = { x: 117, y: 387 };
  public askPos: Position = { x: 255, y: 387 };
  public shortRect: Rectangle = { left: 27, top: 501, width: 100, height: 520 };
  public longRect: Rectangle = { left: 182, top: 501, width: 259, height: 520 };

  private canvas: HTMLCanvasElement;
  private profit = NaN;
  private profitOCR: AutoTradeOcr;
  private lossCut = NaN;

  public autoAccept = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.profitOCR = new AutoTradeOcr(canvas);
  }

  public getOrderInfo() {
    return {
      order: this.getOrderNow(),
      profit: this.profit,
      lossCut: this.lossCut,
    };
  }

  public isFixProfit(): boolean {
    if (!Number.isNaN(this.profit)) {
      if (this.profit > 5) {
        return true;
      }
    }
    return false;
  }

  public isLossCut(bid: number, spread: number): boolean {
    switch (this.orderNow) {
      case "long":
        if (!Number.isNaN(this.lossCut)) {
          if (this.lossCut > bid) {
            return true;
          }
        }
        break;

      case "short":
        if (!Number.isNaN(this.lossCut)) {
          if (this.lossCut < bid + spread) {
            return true;
          }
        }
        break;
    }

    return false;
  }

  public getOrderNow(): ATOrderType | undefined {
    if (this.orderNow == "long" || this.orderNow == "short") {
      return this.orderNow;
    }
    return undefined;
  }

  public async autoSettle() {
    if (!this.autoAccept) return;

    switch (this.orderNow) {
      // settle ask
      case "long":
        if (!this.bidPos) return;
        console.log(`ask settlement ${this.orderNow}`);
        // ask注文時、bidを押すと決済
        await mouseClick(this.left, this.canvas, this.bidPos);
        this.profitOCR.clear();
        this.profit = NaN;
        this.lossCut = NaN;
        break;

      // settle bid
      case "short":
        if (!this.askPos) return;
        console.log(`bid settlement ${this.orderNow}`);
        // bid注文時、askを押すと決済
        await mouseClick(this.left, this.canvas, this.askPos);
        this.profitOCR.clear();
        this.profit = NaN;
        this.lossCut = NaN;
        break;
    }
  }

  public async autoOrder(order: ATOrderType, lossCut: number) {
    if (!this.autoAccept) return;

    // auto control
    switch (order) {
      // ask
      case "long":
        await this.autoSettle();

        if (this.longRect && this.askPos) {
          await mouseClick(this.left, this.canvas, this.askPos);
          this.orderNow = "long";
          this.lossCut = lossCut;

          const rect: Rectangle = {
            left: this.longRect.left,
            top: this.longRect.top,
            width: this.longRect.width - this.longRect.left,
            height: this.longRect.height - this.longRect.top,
          };

          this.profitOCR.recognoze((text) => {
            const v = parseFloat(text);
            if (!Number.isNaN(v)) {
              this.profit = v;
            }
          }, rect);
        }

        break;

      // bid
      case "short":
        await this.autoSettle();

        if (this.shortRect && this.bidPos) {
          mouseClick(this.left, this.canvas, this.bidPos);
          this.orderNow = "short";
          this.lossCut = lossCut;

          const rect: Rectangle = {
            left: this.shortRect.left,
            top: this.shortRect.top,
            width: this.shortRect.width - this.shortRect.left,
            height: this.shortRect.height - this.shortRect.top,
          };

          this.profitOCR.recognoze((text) => {
            const v = parseFloat(text);
            if (!Number.isNaN(v)) {
              this.profit = v;
            }
          }, rect);
        }
        break;

      // cancel position
      case "cross":
        await this.autoSettle();
        this.orderNow = "";
        break;

      default:
        break;
    }
  }
}

class AutoTradeOcr {
  private canvas: HTMLCanvasElement;
  private worker?: Worker;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public async recognoze(
    callback: (text: string) => void,
    rectangle: Rectangle,
  ): Promise<void> {
    if (!this.worker) {
      this.worker = await createWorker("eng");
    }

    try {
      while (this.worker) {
        const ret = await this.worker.recognize(this.canvas, { rectangle });
        const ctx = this.canvas.getContext("2d");
        ctx?.strokeRect(
          rectangle.left,
          rectangle.top,
          rectangle.width,
          rectangle.height,
        );

        callback(ret.data.text);

        await timer(50);
      }
    } catch (error) {
      console.log(error);
      await this.worker.terminate();
    }
    this.worker = undefined;
  }

  public async clear(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = undefined;
    }
  }
}
