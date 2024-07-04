import { playerConst } from "../../Game/constants";
import { debounceLog } from "../../Game/helpers/utils";
import { PlayerState } from "../champ";
import { updateCurr } from "./helpers";

export const updatePlayer = (p: PlayerState, deltaT: number) => {
  updateCurr(p.position);
  updateCurr(p.velocity);

  p.position.curr.x += p.velocity.curr.x * deltaT;
  p.position.curr.y += p.velocity.curr.y * deltaT;
  p.timer.coyoteTime += deltaT;
  p.timer.spriteTimer += deltaT;

  //   debounceLog(p.position.prev.x);

  if (p.queueActions.includes("MoveRight")) {
    p.velocity.curr.x = playerConst.moveSpeed;
  } else if (p.queueActions.includes("MoveLeft")) {
    p.velocity.curr.x = -playerConst.moveSpeed;
  } else {
    p.velocity.curr.x = 0;
  }

  if (p.queueActions.includes("StopY")) {
    p.velocity.curr.y = 0;
  }
  if (p.queueActions.includes("StopX")) {
    p.velocity.curr.x = 0;
  }
  p.queueActions = [];

  return;
};
