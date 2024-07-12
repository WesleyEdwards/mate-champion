import { Champ, champConst } from "../../champ";
import { UpdateFun } from "../helpers";
import { handleChampActions } from "./actions";
import { updateChampSpriteInfo } from "./spriteInfo";

export const updatePlayer: UpdateFun<Champ> = (p, deltaT) => {
  // update with gravity
  if (p.gravityFactor) {
    p.gravityFactor *= champConst.jumpGravityFrameDecrease;
  }
  if (p.velocity.y > 0 || !p.jump.isJumping) {
    p.gravityFactor = null;
  }
  if (p.timers.coyote.val > champConst.maxCoyoteTime || p.velocity.y < 0) {
    const jumpFactor = p.gravityFactor
      ? (1 - p.gravityFactor) * champConst.gravity
      : champConst.gravity;

    p.velocity.y = p.velocity.y + jumpFactor * deltaT;
  }

  handleChampActions(p);
  updateChampSpriteInfo(p);
  return;
};
