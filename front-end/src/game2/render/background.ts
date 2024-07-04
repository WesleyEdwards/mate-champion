import bgImageUrl from "../../assets/clouds-bg.jpg";
import bgImageClouds from "../../assets/clouds-bg-2.jpg";
import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../../Game/constants";
import { Coordinates } from "../../Game/models";

export const renderBg = (
  cxt: CanvasRenderingContext2D,
  cameraOffset: Coordinates
) => {
  const imageWidth = MAX_CANVAS_WIDTH;
  const bgImage = new Image();
  bgImage.src = bgImageUrl;

  const cloudsBg = new Image();
  cloudsBg.src = bgImageClouds;

  const diff = Math.floor(cameraOffset.x / imageWidth);
  for (let i = 0; i < diff + 2; i++) {
    cxt.drawImage(
      bgImage,
      -(cameraOffset.x - i * imageWidth),
      cameraOffset.y,
      MAX_CANVAS_WIDTH,
      MAX_CANVAS_HEIGHT
    );
    cxt.beginPath();
    cxt.moveTo(
      -(cameraOffset.x - i * imageWidth),
      cameraOffset.y - MAX_CANVAS_HEIGHT
    );

    cxt.drawImage(
      cloudsBg,
      -(cameraOffset.x - i * imageWidth),
      cameraOffset.y - MAX_CANVAS_HEIGHT,
      MAX_CANVAS_WIDTH,
      MAX_CANVAS_HEIGHT
    );
  }
};
