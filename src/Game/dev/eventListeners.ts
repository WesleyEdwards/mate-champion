import { DevContentCreate } from "./DevContentCreate";
import { exportLevelInfo } from "./helpers";

export type DevKeys = {
  shift: boolean;
  ctrl: boolean;
  plus: boolean;
  minus: boolean;
};

const roundToTen = (num: number) => Math.round(num / 10) * 10;

export function addDevEventListeners(
  contentCreator: DevContentCreate,
  canvas: HTMLCanvasElement
) {
  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    contentCreator.mouseDown(roundToTen(e.offsetX), roundToTen(e.offsetY));
  });
  canvas.addEventListener("mousemove", (e) => {
    contentCreator.mouseMove(roundToTen(e.offsetX), roundToTen(e.offsetY));
  });

  canvas.addEventListener("mouseup", (e) => {
    contentCreator.mouseUp(roundToTen(e.offsetX), roundToTen(e.offsetY));
    if (e.ctrlKey) {
      contentCreator.handleCreatePlatform(
        roundToTen(e.offsetX),
        roundToTen(e.offsetY),
        true
      );
      return;;
    }
    if (e.altKey) {
      contentCreator.handleCreatePlatform(
        roundToTen(e.offsetX),
        roundToTen(e.offsetY),
        false
      );
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Delete") {
      return contentCreator.handleDelete();
    }
    if (e.code === "Enter") {
      return exportLevelInfo(contentCreator.objectManager);
    }

    if (e.ctrlKey) {
      if (e.code === "Equal") {
        e.preventDefault();
        return contentCreator.handlePlus();
      }
      if (e.code === "Minus") {
        e.preventDefault();
        return contentCreator.handleMinus();
      }
    }
  });
}
