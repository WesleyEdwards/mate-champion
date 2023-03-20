import {
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
  END_POS,
  winState,
} from "../constants";

export class GameDrawer {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }
  draw(showMessage: boolean, winState: winState, level: number) {
    if (showMessage) {
      this.displayNextLevel(winState, level);
      return;
    }
    this.drawBackground();
    this.drawLava();
  }

  drawBackground() {
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
  }

  drawLava() {
    this.context.fillStyle = "red";
    this.context.fillRect(-100, MAX_CANVAS_HEIGHT - 5, END_POS + 100, 5);
  }

  displayNextLevel(winState: winState, level: number) {
    const message = winState === "loseLife" ? "Try Again" : `Level ${level}`;
    this.context.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
    this.context.font = "60px Courier";
    this.context.fillStyle = "green";
    this.context.fillText(message, MAX_CANVAS_WIDTH / 3, MAX_CANVAS_HEIGHT / 2);
  }
}
