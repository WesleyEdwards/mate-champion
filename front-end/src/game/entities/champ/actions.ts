import _ from "lodash"
import {champConst, ChampDirectionY, ChampBase, Champ} from "./champ"
import {ActionMap} from "../../state/helpers"
import {Coors} from "../entityTypes"
import {mBulletConst} from "../bullet"
import {WithVelType} from "../VelocityMixin"

export type ChampAction =
  | {name: "moveX"; dir: "left" | "right"}
  | {name: "stopX"}
  | {name: "jump"}
  | {name: "melee"}
  | {name: "shoot"}
  | {name: "setFacingY"; dir: ChampDirectionY}
  | {name: "setY"; y: number; onEntity?: boolean}
  | {name: "setX"; x: number}
  | {name: "kill"}

export const processActionMap: ActionMap<
  ChampAction,
  InstanceType<WithVelType<ChampBase>>
> = {
  moveX: (p, act) => {
    if (act.dir === "left") {
      p.velocity[0] = -champConst.moveSpeed
    } else {
      p.velocity[0] = champConst.moveSpeed
    }
    p.state.facing.x = act.dir
  },
  stopX: (p, _) => {
    p.velocity[0] = 0
  },
  jump: (p, _) => {
    p.velocity[1] = champConst.jumpSpeed
    p.position.curr[1] -= 1
    p.state.gravityFactor = champConst.jumpGravityFactor
    p.state.jump.isJumping = true
    p.state.jump.jumps += 1
  },
  melee: (p, _) => {
    p.state.action = "melee"
    p.state.timers.actionTimeRemain.val = champConst.melee.time
    p.state.timers.actionCoolDownRemain.val = champConst.melee.coolDown * 2
  },
  shoot: (p, _) => {
    p.state.action = "shoot"
    p.state.timers.actionTimeRemain.val = champConst.shootCoolDown
    p.state.timers.actionCoolDownRemain.val = champConst.shootCoolDown * 2
    const x = (() => {
      if (p.state.facing.y === "up") {
        return p.posLeft + p.width / 2
      }
      if (p.state.facing.x === "right") {
        return p.posLeft + p.width
      }
      return p.posLeft
    })()

    const y = (() => {
      if (p.state.facing.y === "up") {
        return p.position.curr[1]
      }
      return p.position.curr[1] + p.height / 2
    })()

    const velocity = ((): Coors => {
      if (p.state.facing.y === "up") {
        return [0, -mBulletConst.speed]
      }
      if (p.state.facing.x === "right") {
        return [mBulletConst.speed, 0]
      }
      return [-mBulletConst.speed, 0]
    })()

    p.state.publishQueue.push({
      name: "shoot",
      initPos: [x, y],
      velocity
    })
  },
  setFacingY: (p, act) => {
    p.state.facing.y = act.dir
  },
  setY: (p, act) => {
    p.position.curr[1] = act.y
    if (act.onEntity) {
      p.velocity[1] = 0
      p.state.timers.coyote.val = 0
    }
  },
  setX: (p, act) => {
    p.position.curr[0] = act.x
  },
  kill: (p, act) => {
    p.dead = true
  }
}
