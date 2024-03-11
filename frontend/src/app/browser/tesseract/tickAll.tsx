import { useRef } from "react";
import { Tesseract } from "../../../ocr/tesseract";
import { ConnectionOCR } from "../../../ocr/connection";

export const UseTesseractTickAll: React.FC<{
  id: string;
  canvas: HTMLCanvasElement;
}> = ({ id, canvas }) => {
  const rb1 = { left: 67, top: 660, width: 152, height: 718 };
  const rb2 = { left: 165, top: 660, width: 238, height: 718 };
  const rb3 = { left: 238, top: 656, width: 271, height: 698 };

  const ra1 = { left: 310, top: 660, width: 392, height: 718 };
  const ra2 = { left: 401, top: 660, width: 478, height: 718 };
  const ra3 = { left: 478, top: 656, width: 511, height: 698 };

  const topB1Ref = useRef<HTMLInputElement>(null);
  const leftB1Ref = useRef<HTMLInputElement>(null);
  const widthB1Ref = useRef<HTMLInputElement>(null);
  const heightB1Ref = useRef<HTMLInputElement>(null);

  const topB2Ref = useRef<HTMLInputElement>(null);
  const leftB2Ref = useRef<HTMLInputElement>(null);
  const widthB2Ref = useRef<HTMLInputElement>(null);
  const heightB2Ref = useRef<HTMLInputElement>(null);

  const topB3Ref = useRef<HTMLInputElement>(null);
  const leftB3Ref = useRef<HTMLInputElement>(null);
  const widthB3Ref = useRef<HTMLInputElement>(null);
  const heightB3Ref = useRef<HTMLInputElement>(null);

  const topA1Ref = useRef<HTMLInputElement>(null);
  const leftA1Ref = useRef<HTMLInputElement>(null);
  const widthA1Ref = useRef<HTMLInputElement>(null);
  const heightA1Ref = useRef<HTMLInputElement>(null);

  const topA2Ref = useRef<HTMLInputElement>(null);
  const leftA2Ref = useRef<HTMLInputElement>(null);
  const widthA2Ref = useRef<HTMLInputElement>(null);
  const heightA2Ref = useRef<HTMLInputElement>(null);

  const topA3Ref = useRef<HTMLInputElement>(null);
  const leftA3Ref = useRef<HTMLInputElement>(null);
  const widthA3Ref = useRef<HTMLInputElement>(null);
  const heightA3Ref = useRef<HTMLInputElement>(null);

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
            className="btn btn-sm btn-outline text-base btn-info"
            ref={(c) => {
              if (c) {
                c.onclick = () => {
                  if (connection.getIsLoop()) {
                    connection.stopLoop();
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
          recB1 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftB1Ref}
            type="number"
            min={1}
            defaultValue={rb1.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topB1Ref}
            type="number"
            min={1}
            defaultValue={rb1.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthB1Ref}
            type="number"
            min={1}
            defaultValue={rb1.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightB1Ref}
            type="number"
            min={1}
            defaultValue={rb1.height}
          />
        </div>
        <div>
          rectB2 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftB2Ref}
            type="number"
            min={1}
            defaultValue={rb2.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topB2Ref}
            type="number"
            min={1}
            defaultValue={rb2.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthB2Ref}
            type="number"
            min={1}
            defaultValue={rb2.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightB2Ref}
            type="number"
            min={1}
            defaultValue={rb2.height}
          />
        </div>
        <div>
          rectB3 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftB3Ref}
            type="number"
            min={1}
            defaultValue={rb3.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topB3Ref}
            type="number"
            min={1}
            defaultValue={rb3.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthB3Ref}
            type="number"
            min={1}
            defaultValue={rb3.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightB3Ref}
            type="number"
            min={1}
            defaultValue={rb3.height}
          />
        </div>
        <div>
          recA1 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftA1Ref}
            type="number"
            min={1}
            defaultValue={ra1.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topA1Ref}
            type="number"
            min={1}
            defaultValue={ra1.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthA1Ref}
            type="number"
            min={1}
            defaultValue={ra1.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightA1Ref}
            type="number"
            min={1}
            defaultValue={ra1.height}
          />
        </div>
        <div>
          rectA2 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftA2Ref}
            type="number"
            min={1}
            defaultValue={ra2.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topA2Ref}
            type="number"
            min={1}
            defaultValue={ra2.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthA2Ref}
            type="number"
            min={1}
            defaultValue={ra2.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightA2Ref}
            type="number"
            min={1}
            defaultValue={ra2.height}
          />
        </div>
        <div>
          rectA3 &nbsp; left:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={leftA3Ref}
            type="number"
            min={1}
            defaultValue={ra3.left}
          />
          &nbsp; top:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={topA3Ref}
            type="number"
            min={1}
            defaultValue={ra3.top}
          />
          &nbsp; width:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={widthA3Ref}
            type="number"
            min={1}
            defaultValue={ra3.width}
          />
          &nbsp; height:{" "}
          <input
            className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
            ref={heightA3Ref}
            type="number"
            min={1}
            defaultValue={ra3.height}
          />
        </div>
        <button
          className="btn btn-sm btn-outline text-base btn-accent"
          ref={(c) => {
            if (c) {
              c.onclick = async () => {
                const topB1 = topB1Ref.current?.value;
                const leftB1 = leftB1Ref.current?.value;
                const widthB1 = widthB1Ref.current?.value;
                const heightB1 = heightB1Ref.current?.value;

                const topB2 = topB2Ref.current?.value;
                const leftB2 = leftB2Ref.current?.value;
                const widthB2 = widthB2Ref.current?.value;
                const heightB2 = heightB2Ref.current?.value;

                const topB3 = topB3Ref.current?.value;
                const leftB3 = leftB3Ref.current?.value;
                const widthB3 = widthB3Ref.current?.value;
                const heightB3 = heightB3Ref.current?.value;

                const topA1 = topA1Ref.current?.value;
                const leftA1 = leftA1Ref.current?.value;
                const widthA1 = widthA1Ref.current?.value;
                const heightA1 = heightA1Ref.current?.value;

                const topA2 = topA2Ref.current?.value;
                const leftA2 = leftA2Ref.current?.value;
                const widthA2 = widthA2Ref.current?.value;
                const heightA2 = heightA2Ref.current?.value;

                const topA3 = topA3Ref.current?.value;
                const leftA3 = leftA3Ref.current?.value;
                const widthA3 = widthA3Ref.current?.value;
                const heightA3 = heightA3Ref.current?.value;

                if (
                  !(
                    topB1 &&
                    leftB1 &&
                    widthB1 &&
                    heightB1 &&
                    topB2 &&
                    leftB2 &&
                    widthB2 &&
                    heightB2 &&
                    topB3 &&
                    leftB3 &&
                    widthB3 &&
                    heightB3 &&
                    topA1 &&
                    leftA1 &&
                    widthA1 &&
                    heightA1 &&
                    topA2 &&
                    leftA2 &&
                    widthA2 &&
                    heightA2 &&
                    topA3 &&
                    leftA3 &&
                    widthA3 &&
                    heightA3
                  )
                )
                  return;

                const rectB1 = {
                  top: parseInt(topB1),
                  left: parseInt(leftB1),
                  width: parseInt(widthB1) - parseInt(leftB1),
                  height: parseInt(heightB1) - parseInt(topB1),
                };

                const rectB2 = {
                  top: parseInt(topB2),
                  left: parseInt(leftB2),
                  width: parseInt(widthB2) - parseInt(leftB2),
                  height: parseInt(heightB2) - parseInt(topB2),
                };

                const rectB3 = {
                  top: parseInt(topB3),
                  left: parseInt(leftB3),
                  width: parseInt(widthB3) - parseInt(leftB3),
                  height: parseInt(heightB3) - parseInt(topB3),
                };

                const rectA1 = {
                  top: parseInt(topA1),
                  left: parseInt(leftA1),
                  width: parseInt(widthA1) - parseInt(leftA1),
                  height: parseInt(heightA1) - parseInt(topA1),
                };

                const rectA2 = {
                  top: parseInt(topA2),
                  left: parseInt(leftA2),
                  width: parseInt(widthA2) - parseInt(leftA2),
                  height: parseInt(heightA2) - parseInt(topA2),
                };

                const rectA3 = {
                  top: parseInt(topA3),
                  left: parseInt(leftA3),
                  width: parseInt(widthA3) - parseInt(leftA3),
                  height: parseInt(heightA3) - parseInt(topA3),
                };

                const callback = (ticks: { bid: number; ask: number }) => {
                  const bid = ticks.bid;
                  const ask = ticks.ask;
                  const spread = Math.floor((ask - bid) * 1000) / 1000;

                  if (
                    !Number.isNaN(bid) &&
                    !Number.isNaN(ask) &&
                    !Number.isNaN(spread)
                  ) {
                    connection.setTick(bid, spread);
                    if (bidRef.current)
                      bidRef.current.textContent = `bid: ${bid.toFixed(3)} | ask: ${ask.toFixed(3)} | spread: ${spread}`;
                  }
                };

                if (ocr) {
                  ocr.clear().then(() => {
                    ocr?.detectTickAll(
                      callback,
                      rectB1,
                      rectB2,
                      rectB3,
                      rectA1,
                      rectA2,
                      rectA3,
                    );
                  });
                } else {
                  ocr = new Tesseract(canvas);
                  ocr.detectTickAll(
                    callback,
                    rectB1,
                    rectB2,
                    rectB3,
                    rectA1,
                    rectA2,
                    rectA3,
                  );
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
    </>
  );
};
