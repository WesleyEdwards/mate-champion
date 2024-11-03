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
import {Champ} from "./champ/champ"
import {GRAVITY} from "../loopShared/constants"
import {GroogInfo} from "../loopShared/models"
import {BaseEntity, Entity} from "./Entity"
import {WithVelocity} from "./VelocityMixin"
import { Coors } from "./entityTypes"

export type GroogState = {
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

class GroogBase extends BaseEntity  {
  velocity: Coors
  state: GroogState
  constructor(g: GroogInfo) {
    super({
      typeId: "groog",
      dimensions: [...groogConst.dimensions],
      position: g.position
    })

    this.velocity = [g.moveSpeed, 0]
    this.state = {
      timeBetweenTurn: g.timeBetweenTurn,
      timeBetweenJump: g.timeBetweenJump,
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
}

export class Groog extends WithVelocity(GroogBase)implements Entity {
  modifyStatsOnDeath = {score: 10}

  step: Entity["step"] = (deltaT) => {
    updateTimers(this.state.timers, deltaT)
    this.move(deltaT)
    if (
      this.state.render.curr === "die" &&
      this.state.timers.dyingTimer.val <= 0
    ) {
      this.dead = true
    }
    if (
      this.state.render.curr !== "die" &&
      this.state.timers.turnX.val > this.state.timeBetweenTurn
    ) {
      this.state.timers.turnX.val = 0
      processGroogActionRaw(this, {
        name: "setFacingX",
        dir: this.velocity[0] > 0 ? "left" : "right"
      })
    }
    if (
      this.state.timers.jump.val > Math.max(this.state.timeBetweenJump, 700)
    ) {
      this.state.timers.jump.val = 0
      processGroogActionRaw(this, {name: "jump"})
    }

    this.velocity[1] += GRAVITY * deltaT

    processGroogActions(this)
  }

  render: Entity["render"] = (cxt) => {
    renderGroog(this, cxt)
  }

  handleInteraction: Entity["handleInteraction"] = (entities) => {
    for (const entity of entities) {
      if (entity.typeId === "floor" || entity.typeId === "platform") {
        const {x, bottom, top, inline} = calcPlatEntityCollision(this, entity)
        if (x !== null) {
          processGroogActionRaw(this, {name: "setX", x})
        }
        if (bottom !== null) {
          processGroogActionRaw(this, {name: "setY", y: bottom})
        }
        if (top !== null) {
          processGroogActionRaw(this, {
            name: "setY",
            y: top,
            onEntity: true
          })
          if (this.posRight > entity.posRight) {
            this.velocity[0] = -Math.abs(this.velocity[0])
          }
          if (this.posLeft < entity.posLeft) {
            this.velocity[0] = Math.abs(this.velocity[0])
          }
        }
      }
      if (this.state.timers.dyingTimer.val > 0) {
        continue
      }
      if (entity.typeId === "player") {
        const touching = areTouching1(
          this.position.curr,
          entity.position.curr,
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
  jumpSpeed: -1.2,
  dieTimer: 500,
  minJumpFrequency: 820,
  noJumpFrequency: 100_000_000
} as const

export type GroogAssetDes = "walk" | "die" | "rising" | "falling"
