import { useRef } from "react";
import { Rectangle } from "tesseract.js";
import { TCMType, TechnicalChartOCR } from "../../../ocr/technical";

export const ReadTCRect: React.FC<{
  type: TCMType;
  canvas: HTMLCanvasElement;
  tcocr: TechnicalChartOCR;
  rectangle?: Rectangle;
}> = ({ type, canvas, tcocr, rectangle }) => {
  const r1 = rectangle ?? {
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const top1Ref = useRef<HTMLInputElement>(null);
  const left1Ref = useRef<HTMLInputElement>(null);
  const width1Ref = useRef<HTMLInputElement>(null);
  const height1Ref = useRef<HTMLInputElement>(null);

  const priceRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div>
        {`${type}`} &nbsp; left:{" "}
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
        <button
          className="btn btn-sm btn-outline text-base btn-accent"
          ref={(c) => {
            if (c) {
              c.onclick = async () => {
                const top1 = top1Ref.current?.value;
                const left1 = left1Ref.current?.value;
                const width1 = width1Ref.current?.value;
                const height1 = height1Ref.current?.value;

                if (!(top1 && left1 && width1 && height1)) return;

                const rect1 = {
                  top: parseInt(top1),
                  left: parseInt(left1),
                  width: parseInt(width1) - parseInt(left1),
                  height: parseInt(height1) - parseInt(top1),
                };

                tcocr.setChartValue(type, { rect: rect1, ref: priceRef });
              };
            }
          }}
        >
          ocr:{`${type} set`}
        </button>
        <div ref={priceRef}>
          {`${type}:`}
          {priceRef.current?.textContent}
        </div>
      </div>
    </>
  );
};
