import { Camera } from "../entityTypes";
import { GameEdit } from "./GameEdit";

export function addDevEventListeners(
  contentCreator: GameEdit,
  canvas: HTMLCanvasElement
) {
  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    e.preventDefault();
    contentCreator.setEventState("mouseDown", true);
    contentCreator.setEventState("mouseDrag", [e.offsetX, e.offsetY]);
  });
  canvas.addEventListener("mousemove", (e) => {
    contentCreator.setEventState("mouseDrag", [e.offsetX, e.offsetY]);
  });

  window.addEventListener("mouseup", (e) => {
    contentCreator.setEventState("mouseDown", false);
    contentCreator.setEventState("mouseUp", [e.offsetX, e.offsetY]);
    contentCreator.setEventState("mouseDrag", null);
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Delete") {
      contentCreator.setEventState("delete", true);
    }
    if (e.ctrlKey) {
      contentCreator.setEventState("ctrl", true);
    }
    if (e.shiftKey) {
      contentCreator.setEventState("shift", true);
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Delete") {
      contentCreator.setEventState("delete", false);
    }
    console.log(e.code);
    if (e.ctrlKey === false) {
      contentCreator.setEventState("ctrl", false);
    }
    if (e.shiftKey === false) {
      contentCreator.setEventState("shift", false);
    }
  });
}
