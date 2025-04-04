import {calcPlatEntityCollision, areTouching1} from "../helpers"
import {renderGroog} from "../render/groog"
import {
  GroogAction,
  processGroogActionRaw,
  processGroogActions
} from "../state/groog"
import {TimerUp, TimerDown, emptyTime, updateTimers} from "../state/timeHelpers"
import {Champ} from "./champ/champ"
import {GRAVITY} from "../loopShared/constants"
import {BaseEntity, Entity} from "./Entity"
import {WithVelocity} from "./VelocityMixin"
import {Coors} from "./entityTypes"
import {TimedEvent, GroogInfo} from "../../api/types"

export type GroogState = {
  timers: {
    sprite: TimerUp
    // dyingTimer: TimerDown
    turnX: TimerDown
    jump: TimerDown
  }
  render: {
    curr: GroogAssetDes
  }
  queueActions: GroogAction[]
}

class GroogBase extends BaseEntity {
  velocity: Coors
  info: GroogInfo
  state: GroogState

  constructor(g: GroogInfo) {
    super({
      typeId: "groog",
      dimensions: [...groogConst.dimensions],
      position: g.position
    })

    this.velocity = [g.facingRight ? g.moveSpeed : -g.moveSpeed, 0]
    this.info = g
    this.state = {
      timers: {
        sprite: emptyTime("up"),
        turnX: {
          count: "down",
          val: nextTurnXTime(g.timeBetweenTurn)
        },
        jump: {
          count: "down",
          val: nextJumpTime(g.timeBetweenJump)
        }
      },
      render: {
        curr: "walk"
      },
      queueActions: []
    }
  }
}
export class Groog extends WithVelocity(GroogBase) implements Entity {
  modifyStatsOnDeath = {score: 10}

  step: Entity["step"] = (deltaT) => {
    updateTimers(this.state.timers, deltaT)
    this.move(deltaT)
    if (this.state.render.curr !== "die" && this.state.timers.turnX.val <= 0) {
      this.state.timers.turnX.val = nextTurnXTime(this.info.timeBetweenTurn)
      processGroogActionRaw(this, {
        name: "setFacingX",
        dir: this.velocity[0] > 0 ? "left" : "right"
      })
    }
    if (this.state.timers.jump.val <= 0) {
      this.state.timers.jump.val = Math.max(
        nextJumpTime(this.info.timeBetweenJump),
        700
      )
      processGroogActionRaw(this, {name: "jump"})
    }

    this.velocity[1] += GRAVITY * deltaT

    processGroogActions(this)
  }

  render: Entity["render"] = (cxt) => {
    cxt.save()
    renderGroog(this, cxt)
    cxt.restore()
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
        }
      }
      if (!!this.dead) {
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
  dieTimer: 500
} as const

const nextTurnXTime = (timeBetweenTurn: TimedEvent) => {
  const map = {
    Time: timeBetweenTurn.time,
    Random: Math.random() * 4000,
    None: 100_000_000
  }

  return map[timeBetweenTurn.type]
}
const nextJumpTime = (timeBetweenJump: TimedEvent) => {
  return {
    Time: timeBetweenJump.time,
    Random: Math.random() * 6000,
    None: 100_000_000
  }[timeBetweenJump.type]
}

export type GroogAssetDes = "walk" | "die" | "rising" | "falling"
