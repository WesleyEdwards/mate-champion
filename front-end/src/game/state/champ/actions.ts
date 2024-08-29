import _ from "lodash"
import {ChampState, champConst, ChampDirectionY} from "../../entities/champ"
import {ActionMap} from "../helpers"
import {Coors} from "../../entities/entityTypes"
import {mBulletConst} from "../../entities/bullet"

export const handleChampActions = (p: ChampState) => {
  cleanActions(p)

  if (!queuedContains(p, "moveX")) {
    processChampActionRaw(p, {name: "stopX"})
  }

  if (!queuedContains(p, "setFacingY")) {
    processChampActionRaw(p, {name: "setFacingY", dir: "hor"})
  }

  for (const a of p.acceptQueue) {
    processChampActionRaw(p, a)
  }

  p.acceptQueue = []
}

const cleanActions = (p: ChampState) => {
  // A list of filters to find actions that are NOT allowed
  const notAllowedFilter = p.acceptQueue.reduce<
    ((act: ChampActionStr) => boolean)[]
  >((acc, curr) => {
    if (curr.name === "jump") {
      const allowedToJump = p.velocity[1] === 0 || p.jump.jumps === 0
      if (allowedToJump) {
        acc.push((a) => a === "setY")
      } else {
        acc.push((a) => a === "jump")
      }
    }
    if (curr.name === "melee" || curr.name === "shoot") {
      if (p.timers.actionCoolDownRemain.val > 0) {
        acc.push((a) => a === "melee" || a === "shoot")
      }
    }

    return acc
  }, [])

  for (const n of notAllowedFilter) {
    p.acceptQueue = p.acceptQueue.filter((a) => !n(a.name))
  }
}

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

export const processChampActionRaw = (
  champ: ChampState,
  action: ChampAction
) => {
  processActionMap[action.name](champ, action as never)
}

const processActionMap: ActionMap<ChampAction, ChampState> = {
  moveX: (p, act) => {
    if (act.dir === "left") {
      p.velocity[0] = -champConst.moveSpeed
    } else {
      p.velocity[0] = champConst.moveSpeed
    }
    p.facing.x = act.dir
  },
  stopX: (p, _) => {
    p.velocity[0] = 0
  },
  jump: (p, _) => {
    p.velocity[1] = champConst.jumpSpeed
    p.position.curr[1] -= 1
    p.gravityFactor = champConst.jumpGravityFactor
    p.jump.isJumping = true
    p.jump.jumps += 1
  },
  melee: (p, _) => {
    p.action = "melee"
    p.timers.actionTimeRemain.val = champConst.melee.time
    p.timers.actionCoolDownRemain.val = champConst.melee.coolDown * 2
  },
  shoot: (p, _) => {
    p.action = "shoot"
    p.timers.actionTimeRemain.val = champConst.shootCoolDown
    p.timers.actionCoolDownRemain.val = champConst.shootCoolDown * 2
    const x = (() => {
      if (p.facing.y === "up") {
        return p.position.curr[0] + p.dimensions[0] / 2
      }
      if (p.facing.x === "right") {
        return p.position.curr[0] + p.dimensions[0]
      }
      return p.position.curr[0]
    })()

    const y = (() => {
      if (p.facing.y === "up") {
        return p.position.curr[1]
      }
      return p.position.curr[1] + p.dimensions[1] / 2
    })()

    const velocity = ((): Coors => {
      if (p.facing.y === "up") {
        return [0, -mBulletConst.speed]
      }
      if (p.facing.x === "right") {
        return [mBulletConst.speed, 0]
      }
      return [-mBulletConst.speed, 0]
    })()

    p.publishQueue.push({
      name: "shoot" as const,
      initPos: [x, y],
      velocity
    })
  },
  setFacingY: (p, act) => {
    p.facing.y = act.dir
  },
  setY: (p, act) => {
    p.position.curr[1] = act.y
    if (act.onEntity) {
      p.velocity[1] = 0
      p.timers.coyote.val = 0
    }
  },
  setX: (p, act) => {
    p.position.curr[0] = act.x
  },
  kill: (p, act) => {
    p.dead = true
  }
}

type ChampActionStr = ChampAction["name"]

const queuedContains = (p: ChampState, act: ChampActionStr): boolean => {
  return p.acceptQueue.some((a) => a.name === act)
}
