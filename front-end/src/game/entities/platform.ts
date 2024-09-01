import {createId} from "../loopShared/utils"
import {Textures} from "../../gameAssets/textures"
import {Coors, CurrAndPrev, Entity} from "./entityTypes"
import {toCurrAndPrev} from "../helpers"

export const floorConst = {
  floorY: 530,
  floorHeight: 60
} as const

export type PlatformState = {
  color: string
  position: CurrAndPrev
  dead: boolean
  dimensions: Coors
}

export class Platform implements Entity {
  id = createId("platform")
  typeId = "platform" as const
  state: PlatformState

  constructor(params: {color: string; position: Coors; dimensions: Coors}) {
    this.state = {
      color: params.color,
      dimensions: params.dimensions,
      position: toCurrAndPrev(params.position),
      dead: false
    }
  }

  step: Entity["step"] = (deltaT) => {}

  render: Entity["render"] = (cxt) => {
    cxt.fillStyle = this.state.color
    cxt.strokeStyle = "black"
    cxt.lineWidth = 4

    const reduceSize = 2

    cxt.fillRect(0, 0, this.state.dimensions[0], this.state.dimensions[1])
    cxt.strokeRect(
      reduceSize,
      reduceSize,
      this.state.dimensions[0] - reduceSize * 2,
      this.state.dimensions[1] - reduceSize * 2
    )
  }
}

export class Floor implements Entity {
  id = createId("floor")
  typeId = "floor" as const
  state: PlatformState

  constructor(params: {color: string; startX: number; width: number}) {
    this.state = {
      color: params.color,
      dimensions: [params.width, floorConst.floorHeight],
      position: toCurrAndPrev([params.startX, floorConst.floorY]),
      dead: false
    }
  }
  step: Entity["step"] = (deltaT) => {}

  render: Entity["render"] = (cxt) => {
    const img = Textures().platform
    const blocksNeeded = Math.ceil(this.state.dimensions[0] / img.width)
    for (let i = 0; i < blocksNeeded; i++) {
      cxt.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        i * img.width,
        0,
        img.width,
        img.height
      )
    }
  }
}
