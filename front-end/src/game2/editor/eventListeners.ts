import { Camera } from "../entityTypes";
import { GameEdit } from "./GameEdit";

export function addDevEventListeners(
  contentCreator: GameEdit,
  canvas: HTMLCanvasElement
) {
  abortController = new AbortController();

  canvas.addEventListener(
    "mousedown",
    (e: MouseEvent) => {
      e.preventDefault();
      contentCreator.setEventState("mouseDown", true);
      contentCreator.setEventState("mousePos", [e.offsetX, e.offsetY]);
    },
    { signal: abortController.signal }
  );
  canvas.addEventListener(
    "mousemove",
    (e) => {
      contentCreator.setEventState("mousePos", [e.offsetX, e.offsetY]);
    },
    { signal: abortController.signal }
  );

  window.addEventListener(
    "mouseup",
    (e) => {
      contentCreator.setEventState("mouseDown", false);
      contentCreator.setEventState("mouseUp", [e.offsetX, e.offsetY]);
    },
    { signal: abortController.signal }
  );

  window.addEventListener(
    "keydown",
    (e) => {
      if (e.code === "Delete") {
        contentCreator.setEventState("delete", true);
      }
      if (e.ctrlKey) {
        contentCreator.setEventState("ctrl", true);
      }
      if (e.shiftKey) {
        contentCreator.setEventState("shift", true);
      }
    },
    { signal: abortController.signal }
  );

  window.addEventListener(
    "keyup",
    (e) => {
      if (e.code === "Delete") {
        contentCreator.setEventState("delete", false);
      }
      if (e.ctrlKey === false) {
        contentCreator.setEventState("ctrl", false);
      }
      if (e.shiftKey === false) {
        contentCreator.setEventState("shift", false);
      }
    },
    { signal: abortController.signal }
  );
}

export const resetAbortController = () => {
  abortController = new AbortController();
}
export let abortController: AbortController = new AbortController();
