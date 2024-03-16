import { useRef } from "react";
import { Tesseract } from "../../../ocr/tesseract";
import { TechnicalChartMethod } from "../../../ocr/technical";
import { AutoTradeMode } from "./autoTrade";
import { ReadTCRect } from "./rectTC";

export const TickTC2: React.FC<{
  canvas: HTMLCanvasElement;
}> = ({ canvas }) => {
  const r1 = { left: 55, top: 322, width: 103, height: 349 };
  const r2 = { left: 106, top: 317, width: 154, height: 349 };
  const r3 = { left: 153, top: 312, width: 171, height: 338 };
  const rs = { left: 191, top: 324, width: 235, height: 343 };

  const bidPos = { x: 174, y: 333 };
  const askPos = { x: 380, y: 328 };
  const chartPos = { x: 668, y: 250 };

  const sma200 = { left: 260, top: 155, width: 323, height: 174 };
  const sma325 = { left: 434, top: 155, width: 500, height: 174 };
  const bolS = { left: 242, top: 182, width: 306, height: 199 };
  const bolAHigh = { left: 402, top: 182, width: 465, height: 199 };
  const bolALow = { left: 469, top: 182, width: 530, height: 199 };
  const bolBHigh = { left: 633, top: 182, width: 696, height: 199 };
  const bolBLow = { left: 700, top: 182, width: 762, height: 199 };

  const shortRect = { left: 45, top: 498, width: 145, height: 528 };
  const longRect = { left: 285, top: 498, width: 381, height: 528 };

  const top1Ref = useRef<HTMLInputElement>(null);
  const left1Ref = useRef<HTMLInputElement>(null);
  const width1Ref = useRef<HTMLInputElement>(null);
  const height1Ref = useRef<HTMLInputElement>(null);

  const top2Ref = useRef<HTMLInputElement>(null);
  const left2Ref = useRef<HTMLInputElement>(null);
  const width2Ref = useRef<HTMLInputElement>(null);
  const height2Ref = useRef<HTMLInputElement>(null);

  const top3Ref = useRef<HTMLInputElement>(null);
  const left3Ref = useRef<HTMLInputElement>(null);
  const width3Ref = useRef<HTMLInputElement>(null);
  const height3Ref = useRef<HTMLInputElement>(null);

  const topsRef = useRef<HTMLInputElement>(null);
  const leftsRef = useRef<HTMLInputElement>(null);
  const widthsRef = useRef<HTMLInputElement>(null);
  const heightsRef = useRef<HTMLInputElement>(null);

  const bidRef = useRef<HTMLDivElement>(null);

  const chartXRef = useRef<HTMLInputElement>(null);
  const chartYRef = useRef<HTMLInputElement>(null);

  const ocr = new Tesseract(canvas);
  const tcm = new TechnicalChartMethod(canvas, {
    bidPos,
    askPos,
    shortRect,
    longRect,
  });

  return (
    <>
      <div>
        <div>
          rect1 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={left1Ref}
            type="number"
            min={1}
            defaultValue={r1.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={top1Ref}
            type="number"
            min={1}
            defaultValue={r1.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={width1Ref}
            type="number"
            min={1}
            defaultValue={r1.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={height1Ref}
            type="number"
            min={1}
            defaultValue={r1.height}
          />
        </div>
        <div>
          rect2 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={left2Ref}
            type="number"
            min={1}
            defaultValue={r2.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={top2Ref}
            type="number"
            min={1}
            defaultValue={r2.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={width2Ref}
            type="number"
            min={1}
            defaultValue={r2.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={height2Ref}
            type="number"
            min={1}
            defaultValue={r2.height}
          />
        </div>
        <div>
          rect3 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={left3Ref}
            type="number"
            min={1}
            defaultValue={r3.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={top3Ref}
            type="number"
            min={1}
            defaultValue={r3.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={width3Ref}
            type="number"
            min={1}
            defaultValue={r3.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={height3Ref}
            type="number"
            min={1}
            defaultValue={r3.height}
          />
        </div>
        <div>
          rects &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftsRef}
            type="number"
            min={1}
            defaultValue={rs.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topsRef}
            type="number"
            min={1}
            defaultValue={rs.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthsRef}
            type="number"
            min={1}
            defaultValue={rs.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightsRef}
            type="number"
            min={1}
            defaultValue={rs.height}
          />
        </div>
        <button
          className="btn btn-sm btn-outline text-base btn-accent"
          ref={(c) => {
            if (c) {
              c.onclick = async () => {
                const top1 = top1Ref.current?.value;
                const left1 = left1Ref.current?.value;
                const width1 = width1Ref.current?.value;
                const height1 = height1Ref.current?.value;

                const top2 = top2Ref.current?.value;
                const left2 = left2Ref.current?.value;
                const width2 = width2Ref.current?.value;
                const height2 = height2Ref.current?.value;

                const top3 = top3Ref.current?.value;
                const left3 = left3Ref.current?.value;
                const width3 = width3Ref.current?.value;
                const height3 = height3Ref.current?.value;

                const tops = topsRef.current?.value;
                const lefts = leftsRef.current?.value;
                const widths = widthsRef.current?.value;
                const heights = heightsRef.current?.value;

                if (
                  !(
                    top1 &&
                    left1 &&
                    width1 &&
                    height1 &&
                    top2 &&
                    left2 &&
                    width2 &&
                    height2 &&
                    top3 &&
                    left3 &&
                    width3 &&
                    height3
                  )
                )
                  return;

                const rect1 = {
                  top: parseInt(top1),
                  left: parseInt(left1),
                  width: parseInt(width1) - parseInt(left1),
                  height: parseInt(height1) - parseInt(top1),
                };

                const rect2 = {
                  top: parseInt(top2),
                  left: parseInt(left2),
                  width: parseInt(width2) - parseInt(left2),
                  height: parseInt(height2) - parseInt(top2),
                };

                const rect3 = {
                  top: parseInt(top3),
                  left: parseInt(left3),
                  width: parseInt(width3) - parseInt(left3),
                  height: parseInt(height3) - parseInt(top3),
                };

                const rects =
                  tops && lefts && widths && heights
                    ? {
                        top: parseInt(tops),
                        left: parseInt(lefts),
                        width: parseInt(widths) - parseInt(lefts),
                        height: parseInt(heights) - parseInt(tops),
                      }
                    : undefined;

                const callback = (tick: number, sp?: number) => {
                  if (!Number.isNaN(tick) && sp && !Number.isNaN(sp)) {
                    tcm.setTick(tick, sp);
                    if (bidRef.current)
                      bidRef.current.textContent = `bid: ${tick} | spread: ${sp}`;
                  }
                };

                ocr.clear().then(() => {
                  ocr.detectTick2(callback, rect1, rect2, rect3, rects);
                });
              };
            }
          }}
        >
          {`ocr: bid and spread`}
        </button>
        &nbsp;
        <button
          className="btn btn-sm btn-outline text-base btn-warning"
          ref={(c) => {
            if (c) {
              c.onclick = () => {
                if (ocr) ocr.clear();
              };
            }
          }}
        >
          stop
        </button>
        <div ref={bidRef}>bid: {bidRef.current?.textContent}</div>
      </div>
      <div>
        <ReadTCRect
          type={"sma200"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={sma200}
        />
        <ReadTCRect
          type={"sma325"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={sma325}
        />
        <ReadTCRect
          type={"bolS"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={bolS}
        />
        <ReadTCRect
          type={"bolAHigh"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={bolAHigh}
        />
        <ReadTCRect
          type={"bolALow"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={bolALow}
        />
        <ReadTCRect
          type={"bolBHigh"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={bolBHigh}
        />
        <ReadTCRect
          type={"bolBLow"}
          canvas={canvas}
          tcocr={tcm.tcocr}
          rectangle={bolBLow}
        />
        <div>
          {"chart click x: "}
          <input
            className="input input-sm input-bordered input-primary w-20 max-w-sm text-base"
            ref={chartXRef}
            type="number"
            min={1}
            defaultValue={chartPos.x}
          />
          {", y: "}
          <input
            className="input input-sm input-bordered input-primary w-20 max-w-sm text-base"
            ref={chartYRef}
            type="number"
            min={1}
            defaultValue={chartPos.y}
          />
          &nbsp;
          <button
            className="btn btn-sm btn-outline text-base btn-base-content"
            ref={(c) => {
              if (c) {
                c.onclick = () => {
                  const cx = chartXRef.current?.value;
                  const cy = chartYRef.current?.value;
                  if (!(cx && cy)) return;

                  tcm.tcocr.setUpdateChartPos({
                    x: parseInt(cx),
                    y: parseInt(cy),
                  });
                };
              }
            }}
          >
            {`set chart click position`}
          </button>
          {` loop Trade: `}
          <button
            className="btn btn-sm btn-outline text-base btn-info"
            ref={(c) => {
              if (c) {
                c.onclick = () => {
                  if (tcm.getIsLoop()) {
                    tcm.stopLoop();
                    c.textContent = `run loop`;
                  } else {
                    tcm.loopAutoTrade();
                    c.textContent = `stop`;
                  }
                };
              }
            }}
          >
            run loop
          </button>
        </div>
        <AutoTradeMode autoTrade={tcm.tcat} />
        <LogicConf tcm={tcm} />
      </div>
    </>
  );
};

const LogicConf: React.FC<{
  tcm: TechnicalChartMethod;
}> = ({ tcm }) => {
  const diffABRef = useRef<HTMLInputElement>(null);
  const sizeARef = useRef<HTMLInputElement>(null);
  const overRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div>
        {"Logic Config diff-AB: "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={diffABRef}
          type="number"
          step={0.001}
          min={0.001}
          max={1}
          defaultValue={tcm.conf.diffAB}
        />
        {" sizeA: "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={sizeARef}
          type="number"
          step={0.001}
          min={0.001}
          max={1}
          defaultValue={tcm.conf.sizeA}
        />
        {" over: "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={overRef}
          type="number"
          step={0.001}
          min={-0.001}
          max={1}
          defaultValue={tcm.conf.over}
        />
        &nbsp;
        <button
          className="btn btn-sm btn-outline text-base btn-info"
          ref={(c) => {
            if (c) {
              c.onclick = () => {
                const diffAB = diffABRef.current?.value;
                const sizeA = sizeARef.current?.value;
                const over = overRef.current?.value;
                if (diffAB && sizeA && over) {
                  tcm.conf = {
                    diffAB: parseFloat(diffAB),
                    sizeA: parseFloat(sizeA),
                    over: parseFloat(over),
                  };
                  const info = tcm.tcat.getOrderInfo();
                  console.log(
                    `set conf: ${tcm.conf.diffAB}, ${tcm.conf.sizeA}, ${tcm.conf.over} |\n` +
                      `order now: ${info.order}, pro: ${info.profit}, los: ${info.lossCut}`,
                  );
                }
              };
            }
          }}
        >
          set conf
        </button>
      </div>
    </>
  );
};
