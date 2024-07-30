import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../../Game/constants";
import { Textures } from "../../gameAssets/textures";
import { RenderFun } from "./helpers";
import { WinState } from "../../Game/helpers/types";
import { Camera } from "../entityTypes";

export const renderBg = (cam: Camera, cxt: CanvasRenderingContext2D) => {
  const spacesToRight = Math.floor(cam.position[0] / MAX_CANVAS_WIDTH);
  const spacesUp = Math.floor(cam.position[1] / MAX_CANVAS_HEIGHT);

  const widthHeight = [MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT];

  cxt.save();

  const pos = [widthHeight[0] * spacesToRight, widthHeight[1] * spacesUp];

  for (let i = 0; i < 2; i++) {
    cxt.drawImage(
      Textures().background.clouds,
      pos[0],
      pos[1],
      widthHeight[0],
      widthHeight[1]
    );

    cxt.drawImage(
      Textures().background.cloudsTop,
      pos[0],
      pos[1] - widthHeight[1],
      widthHeight[0],
      widthHeight[1]
    );

    cxt.translate(widthHeight[0], 0);
  }

  cxt.restore();
};

export const displayNextLevel = (
  cxt: CanvasRenderingContext2D,
  winState: WinState,
  level: number
) => {
  const message = winState === "loseLife" ? "Try Again" : `Level ${level}`;
  cxt.clearRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
  cxt.font = "60px Courier";
  cxt.fillStyle = "green";
  cxt.fillText(message, MAX_CANVAS_WIDTH / 3 + 40, MAX_CANVAS_HEIGHT / 2);
};
