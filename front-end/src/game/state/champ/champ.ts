import { ChampState, champConst } from "../../entities/champ";
import { UpdateFun } from "../helpers";
import { handleChampActions } from "./actions";
import { updateChampSpriteInfo } from "./spriteInfo";

export const updatePlayer: UpdateFun<ChampState> = (p, deltaT) => {
  // update with gravity
  if (p.gravityFactor) {
    p.gravityFactor *= champConst.jumpGravityFrameDecrease;
  }
  if (p.velocity[1] > 0 || !p.jump.isJumping) {
    p.gravityFactor = null;
  }
  if (p.timers.coyote.val > champConst.maxCoyoteTime || p.velocity[1] < 0) {
    const jumpFactor = p.gravityFactor
      ? (1 - p.gravityFactor) * champConst.gravity
      : champConst.gravity;

    p.velocity[1] = p.velocity[1] + jumpFactor * deltaT;
  }

  if (p.timers.actionTimeRemain.val <= 0) {
    p.action = null;
  }

  if (p.position.curr[1] > 1000) {
    p.dead = true;
  }

  handleChampActions(p);
  updateChampSpriteInfo(p);
  return;
};
