import { timer } from "./util";

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
