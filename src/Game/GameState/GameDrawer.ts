import bgImageUrl from "../../assets/back-ground.png";
import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT, END_POS } from "../constants";
import { Canvas, WinState } from "../helpers/types";

export class GameDrawer {
  constructor() {
    // context.rotate(60)
    // context.arc
  }

  drawBackground(
    cxt: Canvas,
    showMessage: boolean,
    winState: WinState,
    level: number,
    scrollOffset: number
  ) {
    if (showMessage) {
      this.displayNextLevel(cxt, winState, level);
      return;
    }
    this.drawBg(cxt, scrollOffset);
    this.drawLava(cxt);
  }

  private drawBg(cxt: Canvas, scrollOffset: number) {
    const imageWidth = MAX_CANVAS_WIDTH;
    const bgImage = new Image();
    bgImage.src = bgImageUrl;
    const diff = Math.floor(scrollOffset / imageWidth);

    for (let i = 0; i < diff + 2; i++) {
      cxt.drawImage(
        bgImage,
        -(scrollOffset - i * imageWidth),
        0,
        MAX_CANVAS_WIDTH,
        MAX_CANVAS_HEIGHT
      );
    }
  }

  private drawLava(cxt: Canvas) {
    cxt.fillStyle = "red";
    cxt.fillRect(-100, MAX_CANVAS_HEIGHT - 5, END_POS + 100, 5);
  }

  private displayNextLevel(cxt: Canvas, winState: WinState, level: number) {
    const message = winState === "loseLife" ? "Try Again" : `Level ${level}`;
    cxt.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
    cxt.font = "60px Courier";
    cxt.fillStyle = "green";
    cxt.fillText(message, MAX_CANVAS_WIDTH / 3, MAX_CANVAS_HEIGHT / 2);
  }
}
