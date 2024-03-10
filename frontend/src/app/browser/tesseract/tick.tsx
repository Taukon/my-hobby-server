import { useRef } from "react";
import { Tesseract, autoMouse } from "../../../ocr/tesseract";
import { ConnectionOCR } from "../../../ocr/connection";

export const UseTesseractTick: React.FC<{
  id: string;
  canvas: HTMLCanvasElement;
}> = ({ id, canvas }) => {
  const r1 = { left: 39, top: 335, width: 80, height: 365 };
  const r2 = { left: 84, top: 335, width: 122, height: 365 };
  const r3 = { left: 122, top: 334, width: 137, height: 354 };
  const rs = { left: 237, top: 279, width: 267, height: 296 };

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

  const addrRef = useRef<HTMLInputElement>(null);
  const connection = new ConnectionOCR();
  const bidRef = useRef<HTMLDivElement>(null);

  let ocr: Tesseract | undefined;

  return (
    <>
      <div>
        <div>
          <input
            className="input input-sm input-bordered input-primary max-w-xs text-base"
            ref={addrRef}
            min={1}
            defaultValue={connection.getServerAddress()}
          />
          &nbsp;
          <button
            className="btn btn-sm btn-outline text-base btn-accent"
            ref={(c) => {
              if (c) {
                c.onclick = () => {
                  if (!connection.isConnected()) {
                    connection.connect();
                    c.disabled = true;
                  }
                };
              }
            }}
          >
            connect
          </button>
          &nbsp;
          <button
            className="btn btn-sm btn-outline text-base btn-warning"
            ref={(c) => {
              if (c) {
                c.onclick = () => {
                  if (connection.getIsloop()) {
                    connection.stoploop();
                    c.textContent = `run loop`;
                  } else {
                    connection.loopSendRate();
                    c.textContent = `stop`;
                  }
                };
              }
            }}
          >
            run loop
          </button>
          &nbsp;
        </div>
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
                    connection.setTick(tick, sp);
                    if (bidRef.current)
                      bidRef.current.textContent = `bid: ${tick} | spread: ${sp}`;
                  }
                };

                if (ocr) {
                  ocr.clear().then(() => {
                    ocr?.detectTick2(callback, rect1, rect2, rect3, rects);
                  });
                } else {
                  ocr = new Tesseract(canvas);
                  ocr.detectTick2(callback, rect1, rect2, rect3, rects);
                }
              };
            }
          }}
        >
          ocr:{id}
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
      </div>
      <div ref={bidRef}>bid: {bidRef.current?.textContent}</div>
      <div>
        auto control:&nbsp;
        <button
          className="btn btn-sm btn-outline text-base btn-base-content"
          ref={(c) => {
            if (c) {
              c.onclick = () => {
                autoMouse(canvas, {
                  button: "contextmenu",
                  pos: { x: 500, y: 500 },
                });
              };
            }
          }}
        >
          auto
        </button>
      </div>
    </>
  );
};
