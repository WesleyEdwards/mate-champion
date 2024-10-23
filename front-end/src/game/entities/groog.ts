import {createId} from "../loopShared/utils"
import {toCurrAndPrev, calcPlatEntityCollision, areTouching1} from "../helpers"
import {renderGroog} from "../render/groog"
import {
  GroogAction,
  processGroogActionRaw,
  processGroogActions
} from "../state/groog"
import {
  TimerUp,
  TimerDown,
  emptyTime,
  updateTimers,
  updatePosAndVel
} from "../state/timeHelpers"
import {Champ} from "./champ"
import {CurrAndPrev, Coors, Entity} from "./entityTypes"
import {GRAVITY} from "../loopShared/constants"
import {GroogInfo} from "../loopShared/models"

export type GroogState = {
  position: CurrAndPrev
  velocity: Coors
  dimensions: Coors
  dead: boolean
  timeBetweenTurn: number
  timeBetweenJump: number
  timers: {
    sprite: TimerUp
    dyingTimer: TimerDown
    turnX: TimerUp
    jump: TimerUp
  }
  render: {
    curr: GroogAssetDes
  }
  queueActions: GroogAction[]
}

export class Groog implements Entity {
  id = createId("groog")
  typeId = "groog" as const
  state: GroogState
  modifyStatsOnDeath = {score: 10}
  constructor(g: GroogInfo) {
    this.state = {
      position: toCurrAndPrev([...g.position]),
      velocity: [g.moveSpeed, 0],
      timeBetweenTurn: g.timeBetweenTurn ?? 3000,
      timeBetweenJump: 2000,
      // timeBetweenJump: g.timeBetweenJump ?? 3000,
      dimensions: [...groogConst.dimensions],
      dead: false,
      timers: {
        sprite: emptyTime("up"),
        dyingTimer: emptyTime("down"),
        turnX: emptyTime("up"),
        jump: emptyTime("up")
      },
      render: {
        curr: "walk"
      },
      queueActions: []
    }
  }

  step: Entity["step"] = (deltaT) => {
    updateTimers(this.state.timers, deltaT)
    updatePosAndVel(this.state.position, this.state.velocity, deltaT)
    if (
      this.state.render.curr === "die" &&
      this.state.timers.dyingTimer.val <= 0
    ) {
      this.state.dead = true
    }
    if (
      this.state.render.curr !== "die" &&
      this.state.timers.turnX.val > this.state.timeBetweenTurn
    ) {
      this.state.timers.turnX.val = 0
      processGroogActionRaw(this.state, {
        name: "setFacingX",
        dir: this.state.velocity[0] > 0 ? "left" : "right"
      })
    }
    if (this.state.timers.jump.val > this.state.timeBetweenJump) {
      console.log("Jump")
      this.state.timers.jump.val = 0
      processGroogActionRaw(this.state, {name: "jump"})
      console.log(this.state.velocity)
    }

    this.state.velocity[1] += GRAVITY * deltaT

    processGroogActions(this.state)
  }

  render: Entity["render"] = (cxt) => {
    renderGroog(this.state, cxt)
  }

  handleInteraction: Entity["handleInteraction"] = (entities) => {
    for (const entity of entities) {
      if (entity.typeId === "floor" || entity.typeId === "platform") {
        const {x, bottom, top} = calcPlatEntityCollision(this, entity)
        if (x !== null) {
          processGroogActionRaw(this.state, {name: "setX", x})
        }
        if (bottom !== null) {
          processGroogActionRaw(this.state, {name: "setY", y: bottom})
        }
        if (top !== null) {
          processGroogActionRaw(this.state, {
            name: "setY",
            y: top,
            onEntity: true
          })
        }
      }
      if (this.state.timers.dyingTimer.val > 0) {
        continue
      }
      if (entity.typeId === "player") {
        const touching = areTouching1(
          this.state.position.curr,
          entity.state.position.curr,
          groogConst.killChampDist
        )
        if (touching && entity instanceof Champ) {
          entity.state.acceptQueue.push({name: "kill"})
        }
      }
    }
  }
}

export const groogConst = {
  dimensions: [80, 80],
  render: {
    imageWidth: 75
  },
  killChampDist: 70,
  pointsGainByKilling: 10,
  jumpSpeed: -1,
  dieTimer: 500
} as const

export type GroogAssetDes = "walk" | "die" | "rising" | "falling"
