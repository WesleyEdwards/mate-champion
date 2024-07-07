import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../../Game/constants";
import { Camera } from "../camera";
import { Textures } from "../../gameAssets/textures";

export const renderBg = (cxt: CanvasRenderingContext2D, camera: Camera) => {
  const diff = Math.floor(camera.position.x / MAX_CANVAS_WIDTH);
  for (let i = 0; i < diff + 2; i++) {
    cxt.drawImage(
      Textures().background.clouds,
      -(camera.position.x - i * MAX_CANVAS_WIDTH),
      camera.position.y,
      MAX_CANVAS_WIDTH,
      MAX_CANVAS_HEIGHT
    );
    cxt.beginPath();
    cxt.moveTo(
      -(camera.position.x - i * MAX_CANVAS_WIDTH),
      camera.position.y - MAX_CANVAS_HEIGHT
    );

    cxt.drawImage(
      Textures().background.cloudsTop,
      -(camera.position.x - i * MAX_CANVAS_WIDTH),
      camera.position.y - MAX_CANVAS_HEIGHT,
      MAX_CANVAS_WIDTH,
      MAX_CANVAS_HEIGHT
    );
  }
};
