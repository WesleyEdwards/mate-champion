import {
  MAX_CANVAS_HEIGHT,
  MAX_CANVAS_WIDTH,
  cameraConst,
} from "../../Game/constants";
import { Camera } from "../camera";
import { RenderFunH } from "./helpers";

export const renderCamera: RenderFunH<Camera> = (cam) => (cxt) => {
  cxt.strokeStyle = "black";

  cxt.moveTo(cameraConst.idealDistFromLeftWall, 0);
  cxt.lineTo(cameraConst.idealDistFromLeftWall, MAX_CANVAS_HEIGHT);
  cxt.stroke();

  cxt.moveTo(0, cameraConst.idealMinDistFromCeiling);
  cxt.lineTo(MAX_CANVAS_WIDTH, cameraConst.idealMinDistFromCeiling);
  cxt.stroke();
};
