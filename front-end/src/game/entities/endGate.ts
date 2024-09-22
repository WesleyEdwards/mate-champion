import {createId} from "../loopShared/utils"
import {Textures} from "../../gameAssets/textures"
import {toCurrAndPrev} from "../helpers"
import {CurrAndPrev, Coors, Entity} from "./entityTypes"

type EndGateState = {
  position: CurrAndPrev
  dimensions: Coors
  dead: boolean
}

export class EndGate implements Entity {
  id = createId("endGate")
  typeId = "endGate" as const
  state: EndGateState

  constructor(pos: Coors) {
    this.state = {
      position: toCurrAndPrev(pos),
      dimensions: [200, 800],
      dead: false
    }
  }

  step: Entity["step"] = (deltaT) => {}

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
