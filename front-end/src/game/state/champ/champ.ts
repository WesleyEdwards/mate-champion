import {Champ, ChampState, champConst} from "../../entities/champ"
import {UpdateFun} from "../helpers"
import {handleChampActions} from "./actions"
import {updateChampSpriteInfo} from "./spriteInfo"

export const updatePlayer: UpdateFun<Champ> = (p, deltaT) => {
  // update with gravity
  if (p.state.gravityFactor) {
    p.state.gravityFactor *= champConst.jumpGravityFrameDecrease
  }
  if (p.velocity[1] > 0 || !p.state.jump.isJumping) {
    p.state.gravityFactor = null
  }
  if (
    p.state.timers.coyote.val > champConst.maxCoyoteTime ||
    p.velocity[1] < 0
  ) {
    const jumpFactor = p.state.gravityFactor
      ? (1 - p.state.gravityFactor) * champConst.gravity
      : champConst.gravity

    p.velocity[1] = p.velocity[1] + jumpFactor * deltaT
  }

  if (p.state.timers.actionTimeRemain.val <= 0) {
    p.state.action = null
  }

  if (p.position.curr[1] > 1000) {
    p.dead = true
  }

  handleChampActions(p)
  updateChampSpriteInfo(p)
  return
}
