import { Worker, createWorker } from "tesseract.js";
import { timer } from "./util";

type Rectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export class Tesseract {
  private canvas: HTMLCanvasElement;
  private worker?: Worker;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public async detectRT(
    callback: (text: string) => void,
    rectangle?: Rectangle,
  ): Promise<void> {
    this.worker = await createWorker("eng");
    try {
      while (this.worker) {
        const ret = await this.worker.recognize(this.canvas, { rectangle });
        if (rectangle) this.showRectangle(rectangle);

        callback(ret.data.text);

        await timer(200);
      }
    } catch (error) {
      console.log(error);
      await this.worker.terminate();
    }
    this.worker = undefined;
  }

  public async detectTick(
    callback: (tick: number, sp?: number) => void,
    rect1: Rectangle,
    rect2: Rectangle,
    rect3: Rectangle,
    rect4: Rectangle,
    rects?: Rectangle, // spread
  ): Promise<void> {
    this.worker = await createWorker("eng");

    try {
      while (this.worker) {
        const ret1 = await this.worker.recognize(this.canvas, {
          rectangle: rect1,
        });
        this.showRectangle(rect1);
        const tickL = parseInt(ret1.data.text);

        const ret2 = await this.worker.recognize(this.canvas, {
          rectangle: rect2,
        });
        this.showRectangle(rect2);
        const tickSl1 = parseInt(ret2.data.text);

        const ret3 = await this.worker.recognize(this.canvas, {
          rectangle: rect3,
        });
        this.showRectangle(rect3);
        const tickSl2 = parseInt(ret3.data.text);

        const ret4 = await this.worker.recognize(this.canvas, {
          rectangle: rect4,
        });
        this.showRectangle(rect3);
        const tickSs = parseInt(ret4.data.text);

        // const tick = checkTick(
        //   `${tickL}.${tickSl.toString().padStart(2, `0`)}${tickSs}`,
        // );
        const tick = checkTick(`${tickL}.${tickSl1}${tickSl2}${tickSs}`);

        // spread
        let spread = NaN;
        if (rects) {
          const rets = await this.worker.recognize(this.canvas, {
            rectangle: rects,
          });
          this.showRectangle(rects);
          const tmp = parseFloat(rets.data.text);
          if (tmp.toFixed(2) == `${tmp.toFixed(1)}0`) {
            spread = tmp * 0.01;
          }
        }

        if (!Number.isNaN(spread)) {
          callback(tick, spread);
        } else {
          callback(tick);
        }

        // await timer(50);
        await timer(25);
      }
    } catch (error) {
      console.log(error);
      await this.worker.terminate();
    }
    this.worker = undefined;
  }

  public async detectTick2(
    callback: (tick: number, sp?: number) => void,
    rect1: Rectangle,
    rect2: Rectangle,
    rect3: Rectangle,
    rects?: Rectangle, // spread
  ): Promise<void> {
    this.worker = await createWorker("eng");

    try {
      while (this.worker) {
        const ret1 = await this.worker.recognize(this.canvas, {
          rectangle: rect1,
        });
        this.showRectangle(rect1);
        const tickL = parseInt(ret1.data.text);

        const ret2 = await this.worker.recognize(this.canvas, {
          rectangle: rect2,
        });
        this.showRectangle(rect2);
        const tickSl = parseInt(ret2.data.text);

        const ret3 = await this.worker.recognize(this.canvas, {
          rectangle: rect3,
        });
        this.showRectangle(rect3);
        const tickSs = parseInt(ret3.data.text);

        const tick = checkTick(
          `${tickL}.${tickSl.toString().padStart(2, `0`)}${tickSs}`,
        );

        // spread
        let spread = NaN;
        if (rects) {
          const rets = await this.worker.recognize(this.canvas, {
            rectangle: rects,
          });
          this.showRectangle(rects);
          const tmp = parseFloat(rets.data.text);
          if (tmp.toFixed(2) == `${tmp.toFixed(1)}0`) {
            // console.log(tmp)
            spread = tmp * 0.01;
          }
        }

        if (!Number.isNaN(spread)) {
          callback(tick, spread);
        } else {
          callback(tick);
        }

        // await timer(50);
        await timer(100);
      }
    } catch (error) {
      console.log(error);
      await this.worker.terminate();
    }
    this.worker = undefined;
  }

  public async detectTickAll(
    callback: (ticks: { bid: number; ask: number }) => void,
    rectB1: Rectangle,
    rectB2: Rectangle,
    rectB3: Rectangle,
    rectA1: Rectangle,
    rectA2: Rectangle,
    rectA3: Rectangle,
  ): Promise<void> {
    this.worker = await createWorker("eng");

    try {
      while (this.worker) {
        const retB1 = await this.worker.recognize(this.canvas, {
          rectangle: rectB1,
        });
        this.showRectangle(rectB1);
        const bidL = parseInt(retB1.data.text);

        const retB2 = await this.worker.recognize(this.canvas, {
          rectangle: rectB2,
        });
        this.showRectangle(rectB2);
        const bidSl = parseInt(retB2.data.text);

        const retB3 = await this.worker.recognize(this.canvas, {
          rectangle: rectB3,
        });
        this.showRectangle(rectB3);
        const bidSs = parseInt(retB3.data.text);

        const retA1 = await this.worker.recognize(this.canvas, {
          rectangle: rectA1,
        });
        this.showRectangle(rectA1);
        const askL = parseInt(retA1.data.text);

        const retA2 = await this.worker.recognize(this.canvas, {
          rectangle: rectA2,
        });
        this.showRectangle(rectA2);
        const askSl = parseInt(retA2.data.text);

        const retA3 = await this.worker.recognize(this.canvas, {
          rectangle: rectA3,
        });
        this.showRectangle(rectA3);
        const askSs = parseInt(retA3.data.text);

        const bid = checkTick(
          `${bidL}.${bidSl.toString().padStart(2, `0`)}${bidSs}`,
        );
        const ask = checkTick(
          `${askL}.${askSl.toString().padStart(2, `0`)}${askSs}`,
        );

        callback({ bid, ask });

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

  private showRectangle(rectangle: Rectangle) {
    const ctx = this.canvas.getContext("2d");
    ctx?.strokeRect(
      rectangle.left,
      rectangle.top,
      rectangle.width,
      rectangle.height,
    );
  }
}

const checkTick = (tickStr: string): number => {
  const tick = Number(tickStr);

  // if(!Number.isNaN(tick) && 1000 > tick && tick > 99 && Math.floor(tick*(10**4)) % 10 == 0){
  if (
    !Number.isNaN(tick) &&
    1000 > tick &&
    tick > 99 &&
    tick.toFixed(4) == `${tick.toFixed(3)}0`
  ) {
    return tick;
  } else {
    console.log(`error: ${tick} | ${tick.toFixed(4) == `${tick.toFixed(3)}0`}`);
    return NaN;
  }
};

type MouseOption = {
  button?: string;
  pos?: { x: number; y: number };
};

export const autoMouse = async (
  canvas: HTMLCanvasElement,
  option: MouseOption,
) => {
  if (option.pos) {
    canvas.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: Math.round(option.pos.x),
        clientY: Math.round(option.pos.y),
      }),
    );

    await timer(10);
  }

  const button = option.button;
  switch (button) {
    case "mousedown":
      canvas.dispatchEvent(new MouseEvent("mousedown"));
      await timer(10);
      break;
    case "mouseup":
      canvas.dispatchEvent(new MouseEvent("mouseup"));
      await timer(10);
      break;
    case "contextmenu":
      canvas.dispatchEvent(new Event("contextmenu"));
      await timer(10);
      break;
    default:
      break;
  }
};
