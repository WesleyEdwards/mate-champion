import {GRAVITY} from "../loopShared/constants"
import {Groog, GroogState, groogConst} from "../entities/groog"
import {ActionMap, UpdateFun} from "./helpers"

type GroogDirX = "left" | "right"

export type GroogAction =
  | {name: "die"}
  | {name: "jump"}
  | {name: "setFacingX"; dir: GroogDirX}
  | {name: "setY"; y: number; onEntity?: boolean}
  | {name: "setX"; x: number}

const processActionMap: ActionMap<GroogAction, Groog> = {
  die: (g, _) => {
    if (g.state.render.curr === "die") return
    g.state.render.curr = "die"
    g.state.timers.dyingTimer.val = groogConst.dieTimer
    g.state.timers.sprite.val = 0
  },
  jump: (g, _) => {
    g.velocity[1] = groogConst.jumpSpeed
    g.position.curr[1] -= 1
  },
  setFacingX: (g, act) => {
    const abs = Math.abs(g.velocity[0])
    g.velocity[0] = act.dir === "left" ? -abs : abs
  },
  setY: (g, act) => {
    g.position.curr[1] = act.y
    if (act.onEntity) {
      g.velocity[1] = 0
    }
  },
  setX: (g, act) => {
    g.position.curr[0] = act.x
  }
}

export const processGroogActionRaw = (g: Groog, act: GroogAction) => {
  processActionMap[act.name](g, act as never)
}

export const processGroogActions = (groog: Groog) => {
  for (const act of groog.state.queueActions) {
    processGroogActionRaw(groog, act)
  }

  groog.state.queueActions = []
}
