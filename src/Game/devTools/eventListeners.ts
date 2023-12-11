import { DevContentCreate } from "./DevContentCreate";
import { exportLevelInfo } from "./helpers";

const roundToTen = (num: number) => Math.round(num / 10) * 10;

export function addDevEventListeners(
  contentCreator: DevContentCreate,
  canvas: HTMLCanvasElement
) {
  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    contentCreator.mouseDown(roundToTen(e.offsetX), roundToTen(e.offsetY));
  });
  canvas.addEventListener("mousemove", (e) => {
    contentCreator.handleKeyEvent("drag", {
      x: roundToTen(e.offsetX),
      y: roundToTen(e.offsetY),
    });
  });

  canvas.addEventListener("mouseup", (e) => {
    contentCreator.mouseUp({
      x: e.offsetX,
      y: e.offsetY,
    });
    if (e.ctrlKey) {
      contentCreator.handleKeyEvent("create", {
        x: roundToTen(e.offsetX),
        y: roundToTen(e.offsetY),
      });
      return;
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Delete") {
      return contentCreator.handleKeyEvent("delete");
    }
    if (e.code === "Enter") {
      return exportLevelInfo(contentCreator.objectManager);
    }

    if (e.ctrlKey) {
      if (e.code === "Equal") {
        e.preventDefault();
        return contentCreator.handleKeyEvent("plus");
      }
      if (e.code === "Minus") {
        e.preventDefault();
        return contentCreator.handleKeyEvent("minus");
      }
    }
  });
}
