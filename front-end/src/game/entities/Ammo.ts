import {Textures} from "../../gameAssets/textures"
import {BaseEntity, Entity} from "./Entity"
import {Coors} from "./entityTypes"

export const packageConst = {width: 60, height: 72, worth: 3} as const

export class Ammo extends BaseEntity {
  modifyStatsOnDeath = {ammo: 3}

  constructor(pos: Coors) {
    super({
      typeId: "ammo",
      position: pos,
      dimensions: [packageConst.width, packageConst.height]
    })
  }

  step: Entity["step"] = (deltaT) => {}

  render: Entity["render"] = (cxt) => {
    cxt.drawImage(Textures().ammo, 0, 0, this.width, this.height)
  }
}
