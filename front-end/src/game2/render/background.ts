import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../../Game/constants";
import { Camera } from "../camera";
import { Textures } from "../../gameAssets/textures";
import { RenderFun } from "./helpers";

export const renderBg: RenderFun<Camera> = (cam) => (cxt) => {
  const spacesToRight = Math.floor(cam.position.x / MAX_CANVAS_WIDTH);
  const spacesUp = Math.floor(cam.position.y / MAX_CANVAS_HEIGHT);

  const widthHeight = { x: MAX_CANVAS_WIDTH, y: MAX_CANVAS_HEIGHT };

  cxt.save();

  cxt.translate(-cam.position.x, -cam.position.y);

  const pos = {
    x: widthHeight.x * spacesToRight,
    y: widthHeight.y * spacesUp,
  };

  for (let i = 0; i < 2; i++) {
    cxt.drawImage(
      Textures().background.clouds,
      pos.x,
      pos.y,
      widthHeight.x,
      widthHeight.y
    );

    cxt.drawImage(
      Textures().background.cloudsTop,
      pos.x,
      pos.y - widthHeight.y,
      widthHeight.x,
      widthHeight.y
    );

    cxt.translate(widthHeight.x, 0);
  }

  cxt.restore();
};
