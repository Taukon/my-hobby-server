import { useRef } from "react";
import { AutoTrade } from "../../../ocr/autoTrade";

export const AutoTradeMode: React.FC<{
  autoTrade: AutoTrade;
}> = ({ autoTrade }) => {
  const bidXRef = useRef<HTMLInputElement>(null);
  const bidYRef = useRef<HTMLInputElement>(null);

  const askXRef = useRef<HTMLInputElement>(null);
  const askYRef = useRef<HTMLInputElement>(null);

  const top1Ref = useRef<HTMLInputElement>(null);
  const left1Ref = useRef<HTMLInputElement>(null);
  const width1Ref = useRef<HTMLInputElement>(null);
  const height1Ref = useRef<HTMLInputElement>(null);

  const top2Ref = useRef<HTMLInputElement>(null);
  const left2Ref = useRef<HTMLInputElement>(null);
  const width2Ref = useRef<HTMLInputElement>(null);
  const height2Ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <div>
        {"Click Order Bid x: "}
        <input
          className="input input-sm input-bordered input-primary w-20 max-w-sm text-base"
          ref={bidXRef}
          type="number"
          min={1}
          defaultValue={autoTrade.bidPos.x}
        />
        {", y:"}
        <input
          className="input input-sm input-bordered input-primary w-20 max-w-sm text-base"
          ref={bidYRef}
          type="number"
          min={1}
          defaultValue={autoTrade.bidPos.y}
        />
        {" |  Ask x: "}
        <input
          className="input input-sm input-bordered input-primary w-20 max-w-sm text-base"
          ref={askXRef}
          type="number"
          min={1}
          defaultValue={autoTrade.askPos.x}
        />
        {", y: "}
        <input
          className="input input-sm input-bordered input-primary w-20 max-w-sm text-base"
          ref={bidYRef}
          type="number"
          min={1}
          defaultValue={autoTrade.askPos.y}
        />
        &nbsp;
        <button
          className="btn btn-sm btn-outline text-base btn-base-content"
          ref={(c) => {
            if (c) {
              c.onclick = () => {
                autoTrade.left = !autoTrade.left;
                c.textContent = `left click ${autoTrade.left ? `off(now on)` : `on(now off)`}`;
              };
            }
          }}
        >
          {`left click ${autoTrade.left ? `off(now on)` : `on(now off)`}`}
        </button>
      </div>
      <div>
        {`short profit box:`}
        &nbsp; left:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={left1Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.shortRect.left}
        />
        &nbsp; top:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={top1Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.shortRect.top}
        />
        &nbsp; width:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={width1Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.shortRect.width}
        />
        &nbsp; height:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={height1Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.shortRect.height}
        />
      </div>
      <div>
        {` long profit box:`}
        &nbsp; left:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={left2Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.longRect.left}
        />
        &nbsp; top:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={top2Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.longRect.top}
        />
        &nbsp; width:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={width2Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.longRect.width}
        />
        &nbsp; height:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={height2Ref}
          type="number"
          min={1}
          defaultValue={autoTrade.longRect.height}
        />
      </div>
      <button
        className="btn btn-sm btn-outline text-base btn-accent"
        ref={(c) => {
          if (c) {
            c.onclick = async () => {
              const bidX = bidXRef.current?.value;
              const bidY = bidYRef.current?.value;
              const askX = askXRef.current?.value;
              const askY = askYRef.current?.value;
              if (!(bidX && bidY && askX && askY)) {
                return;
              }

              autoTrade.bidPos = { x: parseInt(bidX), y: parseInt(bidY) };
              autoTrade.askPos = { x: parseInt(askX), y: parseInt(askY) };

              const top1 = top1Ref.current?.value;
              const left1 = left1Ref.current?.value;
              const width1 = width1Ref.current?.value;
              const height1 = height1Ref.current?.value;

              const top2 = top2Ref.current?.value;
              const left2 = left2Ref.current?.value;
              const width2 = width2Ref.current?.value;
              const height2 = height2Ref.current?.value;

              if (
                !(
                  top1 &&
                  left1 &&
                  width1 &&
                  height1 &&
                  top2 &&
                  left2 &&
                  width2 &&
                  height2
                )
              )
                return;

              autoTrade.shortRect = {
                top: parseInt(top1),
                left: parseInt(left1),
                width: parseInt(width1) - parseInt(left1),
                height: parseInt(height1) - parseInt(top1),
              };

              autoTrade.longRect = {
                top: parseInt(top2),
                left: parseInt(left2),
                width: parseInt(width2) - parseInt(left2),
                height: parseInt(height2) - parseInt(top2),
              };
            };
          }
        }}
      >
        {`set rectangle and position`}
      </button>
      <div>
        auto trade control:&nbsp;
        <button
          className="btn btn-sm btn-outline text-base btn-accent"
          ref={(c) => {
            if (c) {
              c.onclick = () => {
                const acceptNow = autoTrade.autoAccept;
                autoTrade.autoAccept = !acceptNow;
                if (acceptNow) {
                  c.textContent = `auto run`;
                } else {
                  c.textContent = `auto stop`;
                }
              };
            }
          }}
        >
          {autoTrade.autoAccept ? `auto stop` : `auto run`}
        </button>
      </div>
    </>
  );
};
