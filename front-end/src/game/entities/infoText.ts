import {PlayStats} from "../state/models"
import {emptyTime, updateTimers} from "../state/timeHelpers"
import {BaseEntity, Entity} from "./Entity"
import {Coors} from "./entityTypes"
import {WithVelocity} from "./VelocityMixin"

type InfoTextState = {
  message: string
  color: string
}

class InfoTextBase extends BaseEntity {
  velocity: Coors
  state: InfoTextState

  constructor(params: InfoTextState & {initPosition: Coors}) {
    super({
      typeId: "infoText",
      dimensions: [...infoTextConst.dimensions],
      position: params.initPosition
    })
    this.state = params
    this.velocity = [...infoTextConst.velocity]
    this.dead = emptyTime("down", infoTextConst.timeToDissipate)
  }
}

export class InfoText extends WithVelocity(InfoTextBase) implements Entity {
  step: Entity["step"] = (deltaT) => {
    this.move(deltaT)
    return
  }
  render: Entity["render"] = (ctx) => {
    const o = this.dead
      ? (infoTextConst.timeToDissipate - this.dead.val * 2) /
        infoTextConst.timeToDissipate
      : 0
    const opacity = Math.max(0.1, 1 - o)

    ctx.globalAlpha = opacity
    ctx.fillStyle = this.state.color
    ctx.font = "bold 20px Courier"
    ctx.fillText(this.state.message, 0, 0)
    ctx.fillStyle
    return
  }
}

export const infoTextConst = {
  dimensions: [100, 20],
  velocity: [0, -0.06],
  timeToDissipate: 800
} as const

export const createInfoTextFromStats = (
  k: keyof PlayStats,
  v: number,
  entity: Entity
) => {
  const color = {
    score: "blue",
    lives: "",
    level: "",
    ammo: "#025918"
  }[k]
  return {
    color,
    initPosition: entity.position.curr,
    message: `+ ${v}`
  }
}
