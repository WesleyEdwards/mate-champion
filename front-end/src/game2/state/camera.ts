import { cameraConst } from "../../Game/constants";
import { Camera } from "../camera";
import { Champ } from "../champ";
import { updateTimers, updateWithTime } from "./helpers";

export const updateCamera = (cam: Camera, deltaT: number, champ: Champ) => {
  if (champ.velocity.x !== 0 || champ.velocity.y !== 0) {
    cam.time.idleTime.val = 0;
  }

  if (cam.time.idleTime.val > 3000) {
    return;
  }

  updateTimers(cam.time, deltaT);

  updateWithTime(cam.position, cam.velocity, deltaT);

  // Update X
  const playerDistFromWall = champ.position.curr.x - cam.position.x;
  const diffX = playerDistFromWall - cameraConst.idealDistFromLeftWall;
  cam.velocity.x = diffX * 0.02;

  // Update Y
  const distFromCeiling = champ.position.curr.y + cam.position.y;
  const diffY = distFromCeiling - cameraConst.idealMinDistFromCeiling;

  const isBelow = cam.position.y <= 0 && diffY > 0;

  if (isBelow) {
    cam.position.y = 0;
    cam.velocity.y = 0;
    return;
  }

  const fallingFactor = diffY > 30 ? diffY * 0.1 : 1;

  const newVelocity = -diffY * fallingFactor * 0.001;

  cam.velocity.y = newVelocity;

  return;
};
