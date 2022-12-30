import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT } from "./constants";

export function setupGame(): HTMLCanvasElement {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = MAX_CANVAS_WIDTH;
  return canvas;
}

export function handleStartPlaying(canvas: HTMLCanvasElement) {
  canvas.width = MAX_CANVAS_WIDTH;
  canvas.height = MAX_CANVAS_HEIGHT;
}
