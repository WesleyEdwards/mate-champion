import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT, END_POS } from "../constants";

export function drawBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = "grey";
  context.fillRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
}

export function drawLava(context: CanvasRenderingContext2D) {
  context.fillStyle = "red";
  context.fillRect(-100, MAX_CANVAS_HEIGHT - 5, END_POS + 100, 5);
}
