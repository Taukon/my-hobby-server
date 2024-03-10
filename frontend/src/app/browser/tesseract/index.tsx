import { useRef } from "react";
import { Tesseract } from "../../../ocr/tesseract";
import { autoMouse } from "../../../ocr";

type Rectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const UseTesseract: React.FC<{
  id: string;
  canvas: HTMLCanvasElement;
  rectangle: Rectangle;
}> = ({ id, canvas, rectangle }) => {
  const topRef = useRef<HTMLInputElement>(null);
  const leftRef = useRef<HTMLInputElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);

  let ocr: Tesseract | undefined;

  return (
    <>
      <div>
        left:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={leftRef}
          type="number"
          min={1}
          defaultValue={rectangle.left}
        />
        &nbsp; top:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={topRef}
          type="number"
          min={1}
          defaultValue={rectangle.top}
        />
        &nbsp; width:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={widthRef}
          type="number"
          min={1}
          defaultValue={rectangle.width}
        />
        &nbsp; height:{" "}
        <input
          className="input input-sm input-bordered input-primary w-24 max-w-sm text-base"
          ref={heightRef}
          type="number"
          min={1}
          defaultValue={rectangle.height}
        />
        &nbsp;
        <button
          className="btn btn-sm btn-outline text-base btn-accent"
          ref={(c) => {
            if (c) {
              c.onclick = async () => {
                const top = topRef.current?.value;
                const left = leftRef.current?.value;
                const width = widthRef.current?.value;
                const height = heightRef.current?.value;

                if (!(top && left && width && height)) return;

                const rectangle = {
                  top: parseInt(top),
                  left: parseInt(left),
                  width: parseInt(width) - parseInt(left),
                  height: parseInt(height) - parseInt(top),
                };

                const callback = (text: string) => {
                  console.log(`${id}: ${text}`);
                };

                if (ocr) {
                  ocr.clear().then(() => {
                    ocr?.detectRT(callback, rectangle);
                  });
                } else {
                  ocr = new Tesseract(canvas);
                  ocr.detectRT(callback, rectangle);
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
      <AutoControl canvas={canvas} />
    </>
  );
};

const AutoControl: React.FC<{ canvas: HTMLCanvasElement }> = ({ canvas }) => {
  return (
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
  );
};
