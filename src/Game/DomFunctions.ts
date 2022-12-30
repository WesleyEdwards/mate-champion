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
    if (code === "KeyW") gameState.keys.up = true;
    if (code === "KeyD") gameState.keys.right = true;
    if (code === "KeyA") gameState.keys.left = true;
    if (code === "KeyS") gameState.keys.down = true;
    if (code === "Space") gameState.keys.jump = true;
    if (code === "KeyJ") gameState.keys.shoot = true;
    if (code === "KeyK") gameState.keys.shank = true;
  });

  window.addEventListener("keyup", ({ code }) => {
    if (code === "KeyW") gameState.keys.up = false;
    if (code === "KeyD") gameState.keys.right = false;
    if (code === "KeyA") gameState.keys.left = false;
    if (code === "KeyS") gameState.keys.down = false;
    if (code === "Space") gameState.keys.jump = false;
    if (code === "KeyJ") gameState.keys.shoot = false;
    if (code === "KeyK") gameState.keys.shank = false;
  });
}
