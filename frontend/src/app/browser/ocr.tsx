import { UseTesseract } from "./tesseract";
import { UseTesseractTick } from "./tesseract/tick";
import { TickTC } from "./tesseract/tickTC";
import { TickTC2 } from "./tesseract/tickTC2";

export const UseOCR: React.FC<{ canvas: HTMLCanvasElement }> = ({ canvas }) => {
  return (
    <>
      <details>
        <summary>test OCR</summary>
        <UseTesseract
          id={"test"}
          canvas={canvas}
          rectangle={{
            left: 0,
            top: 0,
            width: canvas.width,
            height: canvas.height,
          }}
        />
      </details>
      <details>
        <summary>bid OCR</summary>
        <UseTesseractTick id={"bid"} canvas={canvas} />
      </details>
      {/* <details>
        <summary>bid2 OCR</summary>
        <UseTesseractTick2 id={"bid2"} canvas={canvas} />
      </details>
      <details>
        <summary>tickAll OCR</summary>
        <UseTesseractTickAll id={"tick"} canvas={canvas} />
      </details> */}
      <details>
        <summary>tickTC OCR</summary>
        <TickTC canvas={canvas} />
      </details>
      <details>
        <summary>tickTC2 OCR</summary>
        <TickTC2 canvas={canvas} />
      </details>
    </>
  );
};
