import {Textures} from "../../gameAssets/textures"
import {toCurrAndPrev} from "../helpers"
import {BaseEntity, Entity} from "./Entity"
import {CurrAndPrev, Coors} from "./entityTypes"

type EndGateState = {
  position: CurrAndPrev
  dimensions: Coors
  dead: boolean
}

export class EndGate extends BaseEntity {
  constructor(position: Coors) {
    super({typeId: "endGate", position, dimensions: [200, 800]})
  }

  step: Entity["step"] = () => {}

  render: Entity["render"] = (cxt) => {
    cxt.drawImage(
      Textures().endGate,
      0,
      0,
      Textures().endGate.width,
      Textures().endGate.height,
      -60,
      0,
      300,
      800
    )
  }
}
