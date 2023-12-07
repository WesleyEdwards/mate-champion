import bgImageUrl from "../../assets/back-ground.png";
import {
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
  END_POS,
} from "../constants";
import { WinState } from "../helpers/types";

export class GameDrawer {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    context.rotate(60)
    context.arc
  }

  drawBackground(
    showMessage: boolean,
    winState: WinState,
    level: number,
    scrollOffset: number
  ) {
    if (showMessage) {
      this.displayNextLevel(winState, level);
      return;
    }
    this.drawBg(scrollOffset);
    this.drawLava();
  }

  private drawBg(scrollOffset: number) {
    const imageWidth = MAX_CANVAS_WIDTH;
    const bgImage = new Image();
    bgImage.src = bgImageUrl;
    const diff = Math.floor(scrollOffset / imageWidth);

    for (let i = 0; i < diff + 2; i++) {
      this.context.drawImage(
        bgImage,
        -(scrollOffset - i * imageWidth),
        0,
        MAX_CANVAS_WIDTH,
        MAX_CANVAS_HEIGHT
      );
    }
  }

  private drawLava() {
    this.context.fillStyle = "red";
    this.context.fillRect(-100, MAX_CANVAS_HEIGHT - 5, END_POS + 100, 5);
  }

  private displayNextLevel(winState: WinState, level: number) {
    const message = winState === "loseLife" ? "Try Again" : `Level ${level}`;
    this.context.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
    this.context.font = "60px Courier";
    this.context.fillStyle = "green";
    this.context.fillText(message, MAX_CANVAS_WIDTH / 3, MAX_CANVAS_HEIGHT / 2);
  }
}
