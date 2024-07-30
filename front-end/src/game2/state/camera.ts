import { cameraConst } from "../../Game/constants";
import { ChampState } from "../champ";
import { Camera } from "../entityTypes";
import { updateTimers, updateWithTime } from "./timeHelpers";

export const updateCamera = (cam: Camera, deltaT: number) => {
  updateTimers(cam.time, deltaT);
  updateWithTime(cam.position, cam.velocity, deltaT);
};

export const updateCameraWithPlayer = (cam: Camera, champ: ChampState) => {
  if (champ.velocity[0] !== 0 || champ.velocity[1] !== 0) {
    cam.time.idleTime.val = 0;
  }

  if (cam.time.idleTime.val > 3000) {
    return;
  }

  // Update X
  const playerDistFromWall = champ.position.curr[0] - cam.position[0];
  const diffX = playerDistFromWall - cameraConst.idealDistFromLeftWall;
  cam.velocity[0] = diffX * 0.02;

  // Update Y
  const distFromCeiling = champ.position.curr[1] + cam.position[1];
  const diffY = distFromCeiling - cameraConst.idealMinDistFromCeiling;

  const isBelow = cam.position[1] <= 0 && diffY > 0;

  // window.debounceLog(cam.position);
  if (isBelow) {
    cam.position[1] = 0;
    cam.velocity[1] = 0;
    return;
  }

  const fallingFactor = diffY > 30 ? diffY * 0.1 : 1;

  const newVelocity = -diffY * fallingFactor * 0.001;

  cam.velocity[1] = newVelocity;

  return;
};
