import {Textures} from "../../gameAssets/textures"
import {BaseEntity, Entity} from "./Entity"
import {Coors} from "./entityTypes"

export const floorConst = {
  floorY: 530,
  floorHeight: 60
} as const

export class Platform extends BaseEntity {
  color: string
  constructor(params: {color: string; position: Coors; dimensions: Coors}) {
    super({
      typeId: "platform",
      position: params.position,
      dimensions: params.dimensions
    })
    this.color = params.color
  }

  step: Entity["step"] = (deltaT) => {}

  render: Entity["render"] = (cxt) => {
    cxt.fillStyle = this.color
    cxt.strokeStyle = "black"
    cxt.lineWidth = 4

    const reduceSize = 2

    cxt.fillRect(0, 0, this.width, this.height)
    cxt.strokeRect(
      reduceSize,
      reduceSize,
      this.width - reduceSize * 2,
      this.height - reduceSize * 2
    )
  }
}

export class Floor extends BaseEntity {
  color: string
  constructor(params: {color: string; startX: number; width: number}) {
    super({
      typeId: "floor",
      position: [params.startX, floorConst.floorY],
      dimensions: [params.width, floorConst.floorHeight]
    })
    this.color = params.color
  }
  step: Entity["step"] = (deltaT) => {}

  render: Entity["render"] = (cxt) => {
    const img = Textures().platform
    const blocksNeeded = Math.ceil(this.dimensions[0] / img.width)
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
