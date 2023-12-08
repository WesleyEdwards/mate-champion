import bgImageUrl from "../../assets/back-ground.png";
import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT, END_POS } from "../constants";
import { DevStats } from "../devSettings";
import { Canvas, WinState } from "../helpers/types";
import { Coordinates } from "../models";

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

  showDevStats(cxt: Canvas, coor: Coordinates, vel: Coordinates) {
    cxt.fillStyle = "rgba(0, 0, 0, 0.75)";
    cxt.fillRect(0, 0, 200, 100);
    cxt.font = "20px Courier";
    cxt.fillStyle = "green";
    cxt.fillText(`pos:(${Math.round(coor.x)}, ${Math.round(coor.y)})`, 10, 20);
    cxt.fillText(`vel:(${Math.round(vel.x)}, ${Math.round(vel.y)})`, 10, 50);
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
