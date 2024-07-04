import bgImageUrl from "../../assets/clouds-bg.jpg";
import bgImageClouds from "../../assets/clouds-bg-2.jpg";
import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../../Game/constants";
import { Coordinates } from "../../Game/models";
import { Camera } from "../camera";

export const renderBg = (cxt: CanvasRenderingContext2D, camera: Camera) => {
  const imageWidth = MAX_CANVAS_WIDTH;
  const bgImage = new Image();
  bgImage.src = bgImageUrl;

  const cloudsBg = new Image();
  cloudsBg.src = bgImageClouds;

  const diff = Math.floor(camera.position.x / imageWidth);
  for (let i = 0; i < diff + 2; i++) {
    cxt.drawImage(
      bgImage,
      -(camera.position.x - i * imageWidth),
      camera.position.y,
      MAX_CANVAS_WIDTH,
      MAX_CANVAS_HEIGHT
    );
    cxt.beginPath();
    cxt.moveTo(
      -(camera.position.x - i * imageWidth),
      camera.position.y - MAX_CANVAS_HEIGHT
    );

    cxt.drawImage(
      cloudsBg,
      -(camera.position.x - i * imageWidth),
      camera.position.y - MAX_CANVAS_HEIGHT,
      MAX_CANVAS_WIDTH,
      MAX_CANVAS_HEIGHT
    );
  }
};
