import { Champ, ChampAction, champConst } from "../../champ";
import { updatePosAndVel, updateTimers } from "../helpers";
import { handleChampActions } from "./actions";
import { updateChampSpriteInfo } from "./spriteInfo";

export const updatePlayer = (p: Champ, deltaT: number) => {
  updatePosAndVel(p.position, p.velocity, deltaT);
  updateTimers(p.timer, deltaT);

  // update with gravity
  if (p.gravityFactor) {
    p.gravityFactor *= champConst.jumpGravityFrameDecrease;
  }
  if (p.velocity.y > 0 || !p.jump.isJumping) {
    p.gravityFactor = null;
  }
  if (p.timer.coyote.val > champConst.maxCoyoteTime || p.velocity.y < 0) {
    const jumpFactor = p.gravityFactor
      ? (1 - p.gravityFactor) * champConst.gravity
      : champConst.gravity;

    p.velocity.y = p.velocity.y + jumpFactor * deltaT;
  }

  handleChampActions(p);
  updateChampSpriteInfo(p);
  return;
};