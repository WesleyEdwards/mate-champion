import {
  MAX_CANVAS_HEIGHT,
  MAX_CANVAS_WIDTH,
  cameraConst,
} from "../../Game/constants";
import { Camera } from "../camera";
import { RenderFunH } from "./helpers";

export const renderCamera: RenderFunH<Camera> = (cam) => (cxt) => {
  cxt.strokeStyle = "black";

  // Vertical
  cxt.moveTo(cameraConst.idealDistFromLeftWall, 0);
  cxt.lineTo(cameraConst.idealDistFromLeftWall, MAX_CANVAS_HEIGHT);

  // Horizontal
  cxt.moveTo(0, cameraConst.idealMinDistFromCeiling);
  cxt.lineTo(MAX_CANVAS_WIDTH, cameraConst.idealMinDistFromCeiling);
  cxt.stroke();
};
