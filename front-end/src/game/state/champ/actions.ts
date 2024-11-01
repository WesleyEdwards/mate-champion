import _ from "lodash"
import {
  ChampState,
  champConst,
  ChampDirectionY,
  Champ
} from "../../entities/champ"
import {ActionMap} from "../helpers"
import {Coors} from "../../entities/entityTypes"
import {mBulletConst} from "../../entities/bullet"

export const handleChampActions = (p: Champ) => {
  cleanActions(p)

  if (!queuedContains(p, "moveX")) {
    processChampActionRaw(p, {name: "stopX"})
  }

  if (!queuedContains(p, "setFacingY")) {
    processChampActionRaw(p, {name: "setFacingY", dir: "hor"})
  }

  for (const a of p.state.acceptQueue) {
    processChampActionRaw(p, a)
  }

  p.state.acceptQueue = []
}

const cleanActions = (p: Champ) => {
  // A list of filters to find actions that are NOT allowed
  const notAllowedFilter = p.state.acceptQueue.reduce<
    ((act: ChampActionStr) => boolean)[]
  >((acc, curr) => {
    if (curr.name === "jump") {
      const allowedToJump = p.velocity[1] === 0 || p.state.jump.jumps === 0
      if (allowedToJump) {
        acc.push((a) => a === "setY")
      } else {
        acc.push((a) => a === "jump")
      }
    }
    if (curr.name === "melee" || curr.name === "shoot") {
      if (p.state.timers.actionCoolDownRemain.val > 0) {
        acc.push((a) => a === "melee" || a === "shoot")
      }
    }

    return acc
  }, [])

  for (const n of notAllowedFilter) {
    p.state.acceptQueue = p.state.acceptQueue.filter((a) => !n(a.name))
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
  champ: Champ,
  action: ChampAction
) => {
  processActionMap[action.name](champ, action as never)
}

const processActionMap: ActionMap<ChampAction, Champ> = {
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
      name: "shoot" as const,
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

type ChampActionStr = ChampAction["name"]

const queuedContains = (p: Champ, act: ChampActionStr): boolean => {
  return p.state.acceptQueue.some((a) => a.name === act)
}
