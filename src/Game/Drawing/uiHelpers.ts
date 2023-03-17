import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../constants";

export function getCanvasContext(): {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
} {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  return { canvas, context };
}

export function displayNextLevel(
  context: CanvasRenderingContext2D,
  level: number
) {
  context.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
  context.font = "60px Courier";
  context.fillStyle = "green";
  context.fillText(
    `Level ${level}`,
    MAX_CANVAS_WIDTH / 3,
    MAX_CANVAS_HEIGHT / 2
  );
}

export function displayCanvas(show: boolean, canvas: HTMLCanvasElement) {
  if (show) {
    canvas.height = MAX_CANVAS_HEIGHT;
    canvas.width = MAX_CANVAS_WIDTH;
    return;
  }
  canvas.height = 0;
}
