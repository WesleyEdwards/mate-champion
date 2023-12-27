import bgImageUrl from "../../assets/clouds-bg.jpg";
import bgImageClouds from "../../assets/clouds-bg-2.jpg";
import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT, END_POS } from "../constants";
import { DevStats } from "../devSettings";
import { Canvas, WinState } from "../helpers/types";
import { Coordinates } from "../models";

export class GameDrawer {
  drawBackground(
    cxt: Canvas,
    showMessage: boolean,
    winState: WinState,
    level: number,
    cameraOffset: Coordinates
  ) {
    if (showMessage) {
      this.displayNextLevel(cxt, winState, level);
      return;
    }
    this.drawBg(cxt, cameraOffset);
    this.drawLava(cxt, cameraOffset);
  }

  private drawBg(cxt: Canvas, cameraOffset: Coordinates) {
    const imageWidth = MAX_CANVAS_WIDTH;
    const bgImage = new Image();
    bgImage.src = bgImageUrl;
    const diff = Math.floor(cameraOffset.x / imageWidth);

    const cloudsBg = new Image();
    cloudsBg.src = bgImageClouds;

    for (let i = 0; i < diff + 2; i++) {
      cxt.drawImage(
        bgImage,
        -(cameraOffset.x - i * imageWidth),
        cameraOffset.y,
        MAX_CANVAS_WIDTH,
        MAX_CANVAS_HEIGHT
      );

      cxt.drawImage(
        cloudsBg,
        -(cameraOffset.x - i * imageWidth),
        cameraOffset.y - MAX_CANVAS_HEIGHT,
        MAX_CANVAS_WIDTH,
        MAX_CANVAS_HEIGHT
      );
    }
  }

  showDevStats(cxt: Canvas, coor: Coordinates, vel: Coordinates, fps: number) {
    cxt.fillStyle = "rgba(0, 0, 0, 0.75)";
    cxt.fillRect(0, 0, 200, 100);
    cxt.font = "20px Courier";
    cxt.fillStyle = "green";
    cxt.fillText(`pos:(${Math.round(coor.x)}, ${Math.round(coor.y)})`, 10, 20);
    cxt.fillText(`vel:(${Math.round(vel.x)}, ${Math.round(vel.y)})`, 10, 50);
    cxt.fillText(`fps: ${fps}`, 10, 80);
  }

  private drawLava(cxt: Canvas, cameraOffset: Coordinates) {
    cxt.fillStyle = "red";
    cxt.fillRect(
      -100,
      MAX_CANVAS_HEIGHT - 5 + cameraOffset.y,
      END_POS + 100,
      5
    );
    cxt.beginPath();
    cxt.moveTo(0, 300);
    cxt.lineTo(500, 300);
    cxt.stroke();
  }

  private displayNextLevel(cxt: Canvas, winState: WinState, level: number) {
    const message = winState === "loseLife" ? "Try Again" : `Level ${level}`;
    cxt.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
    cxt.font = "60px Courier";
    cxt.fillStyle = "green";
    cxt.fillText(message, MAX_CANVAS_WIDTH / 3, MAX_CANVAS_HEIGHT / 2);
  }
}
