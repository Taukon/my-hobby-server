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
        clientX: Math.round(option.pos.x + canvas.getBoundingClientRect().left),
        clientY: Math.round(option.pos.y + canvas.getBoundingClientRect().top),
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

export const mouseClick = async (
  isLeft: boolean,
  canvas: HTMLCanvasElement,
  pos: { x: number; y: number },
) => {
  if (isLeft) {
    await autoMouse(canvas, { button: "mousedown", pos: pos });
    await autoMouse(canvas, { button: "mouseup", pos: pos });
    await timer(1000);
  } else {
    await autoMouse(canvas, { button: "contextmenu", pos: pos });
    await timer(1000);
  }
};
