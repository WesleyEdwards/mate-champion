import bgImageUrl from "../../assets/back-ground.png";
import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT, END_POS } from "../constants";
import { Canvas, WinState } from "../helpers/types";

export class GameDrawer {
  constructor() {
    // context.rotate(60)
    // context.arc
  }

  drawBackground(
    ctx: Canvas,
    showMessage: boolean,
    winState: WinState,
    level: number,
    scrollOffset: number
  ) {
    if (showMessage) {
      this.displayNextLevel(ctx, winState, level);
      return;
    }
    this.drawBg(ctx, scrollOffset);
    this.drawLava(ctx);
  }

  private drawBg(ctx: Canvas, scrollOffset: number) {
    const imageWidth = MAX_CANVAS_WIDTH;
    const bgImage = new Image();
    bgImage.src = bgImageUrl;
    const diff = Math.floor(scrollOffset / imageWidth);

    for (let i = 0; i < diff + 2; i++) {
      ctx.drawImage(
        bgImage,
        -(scrollOffset - i * imageWidth),
        0,
        MAX_CANVAS_WIDTH,
        MAX_CANVAS_HEIGHT
      );
    }
  }

  private drawLava(ctx: Canvas) {
    ctx.fillStyle = "red";
    ctx.fillRect(-100, MAX_CANVAS_HEIGHT - 5, END_POS + 100, 5);
  }

  private displayNextLevel(ctx: Canvas, winState: WinState, level: number) {
    const message = winState === "loseLife" ? "Try Again" : `Level ${level}`;
    ctx.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
    ctx.font = "60px Courier";
    ctx.fillStyle = "green";
    ctx.fillText(message, MAX_CANVAS_WIDTH / 3, MAX_CANVAS_HEIGHT / 2);
  }
}
