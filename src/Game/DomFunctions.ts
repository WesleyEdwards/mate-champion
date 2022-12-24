import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT } from "./constants";
import { GameState } from "./GameState";

export function setupGame(): HTMLCanvasElement {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = MAX_CANVAS_WIDTH;
  return canvas;
}

export function handleStartPlaying(canvas: HTMLCanvasElement) {
  canvas.width = MAX_CANVAS_WIDTH;
  canvas.height = MAX_CANVAS_HEIGHT;
}

export function addEventListeners(gameState: GameState) {
  window.addEventListener("keydown", ({ code }) => {
    if (code === "ArrowUp") gameState.keys.up = true;
    if (code === "ArrowRight") gameState.keys.right = true;
    if (code === "ArrowLeft") gameState.keys.left = true;
    if (code === "Space") gameState.keys.space = true;
  });

  window.addEventListener("keyup", ({ code }) => {
    if (code === "ArrowUp") gameState.keys.up = false;
    if (code === "ArrowRight") gameState.keys.right = false;
    if (code === "ArrowLeft") gameState.keys.left = false;
    if (code === "Space") gameState.keys.space = false;
  });
}
