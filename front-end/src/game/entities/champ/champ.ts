import {calcPlatEntityCollision, areTouching1} from "../../helpers"
import {ChampAction, processActionMap} from "./actions"
import {PlayerAction} from "./spriteInfo"
import {TimerUp, TimerDown, emptyTime} from "../../state/timeHelpers"
import {Ammo} from "../Ammo"
import {BaseEntity, Entity} from "../Entity"
import {Coors} from "../entityTypes"
import {Groog} from "../groog"
import {WithVelocity} from "../VelocityMixin"
import {RenderChamp} from "../../render/renderChamp"
import {StepChamp} from "./step"

type ChampPublish = {name: "shoot"; initPos: Coors; velocity: Coors}

export type ChampAssetDes = ChampDescription | "rising" | "falling"

type DirY = "hor" | "up"

export type ChampDescription = `${DirY}-${PlayerAction}-${"walk" | "none"}`

export const champConst = {
  widthHeight: [64, 64],
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  melee: {
    time: 250,
    coolDown: 275,
    reach: 120
  },
  shootCoolDown: 200,
  initPos: {x: 400, y: 400},
  maxCoyoteTime: 80,
  jumpGravityFactor: 0.9,
  jumpGravityFrameDecrease: 0.93,
  render: {
    walkCycleTime: 70,
    imageWidth: 200
  },
  gravity: 0.004
} as const

export type ChampDirectionY = "up" | "down" | "hor"
export type ChampDirectionX = "left" | "right"

export class ChampBase extends BaseEntity {
  velocity: Coors = [0, 0]
  state: {
    facing: {x: ChampDirectionX; y: ChampDirectionY}
    jump: {
      jumps: number
      isJumping: boolean
    }
    action: "shoot" | "melee" | null
    render: {
      prev: ChampAssetDes
      curr: ChampAssetDes
    }
    gravityFactor: number | null
    acceptQueue: ChampAction[]
    publishQueue: ChampPublish[]
    timers: {
      sprite: TimerUp
      coyote: TimerUp
      actionTimeRemain: TimerDown // Time left and cool down are both decreased always
      actionCoolDownRemain: TimerDown // When < 0, the player can take another action
    }
  }

  modifyStatsOnDeath = {lives: -1}
  constructor(position: Coors) {
    super({dimensions: [...champConst.widthHeight], position, typeId: "player"})
    this.state = {
      facing: {x: "right", y: "hor"},
      gravityFactor: null,
      jump: {jumps: 0, isJumping: false},
      action: null,
      render: {
        prev: "hor-none-none",
        curr: "hor-none-none"
      },
      acceptQueue: [],
      publishQueue: [],
      timers: {
        sprite: emptyTime("up"),
        coyote: emptyTime("up"),
        actionTimeRemain: emptyTime("down"),
        actionCoolDownRemain: emptyTime("down")
      }
    }
  }
}

export class Champ
  extends StepChamp(WithVelocity(RenderChamp(ChampBase)))
  implements Entity
{
  handleInteraction: Entity["handleInteraction"] = (entities) => {
    for (const entity of entities) {
      if (entity.typeId === "floor" || entity.typeId === "platform") {
        const {x, bottom, top} = calcPlatEntityCollision(this, entity)
        if (x !== null) this.processChampActionRaw({name: "setX", x})
        if (bottom !== null)
          this.processChampActionRaw({name: "setY", y: bottom})
        if (top !== null)
          this.processChampActionRaw({name: "setY", y: top, onEntity: true})
      }
      if (entity instanceof Groog) {
        if (this.state.action === "melee") {
          const meleePosX = (() => {
            if (this.state.facing.y === "up") {
              return 0
            }
            return this.state.facing.x === "right"
              ? champConst.melee.reach
              : -champConst.melee.reach
          })()
          const meleePosY = (() => {
            if (this.state.facing.y === "up") {
              return -champConst.melee.reach
            }
            return 0
          })()

          if (
            areTouching1(
              [this.posLeft + meleePosX, this.position.curr[1] + meleePosY],
              entity.position.curr,
              champConst.melee.reach / 2
            )
          ) {
            entity.state.queueActions.push({name: "die"})
          }
        }
      }
      if (entity instanceof Ammo) {
        if (areTouching1(this.position.curr, entity.position.curr, 100)) {
          entity.dead = emptyTime("down", 0)
        }
      }
    }
  }
}
