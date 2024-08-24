import { createId } from "../loopShared/utils";
import { Textures } from "../../gameAssets/textures";
import { toCurrAndPrev } from "../helpers";
import { Coors, CurrAndPrev, Entity } from "./entityTypes";

export const packageConst = { width: 60, height: 72, worth: 3 } as const;

type AmmoState = {
  position: CurrAndPrev;
  dimensions: Coors;
  dead: boolean;
};

export class Ammo implements Entity {
  id = createId();
  typeId = "ammo" as const;
  state: AmmoState;
  modifyStatsOnDeath = {
    ammo: 3,
  };

  constructor(public pos: Coors) {
    this.state = {
      position: toCurrAndPrev(pos),
      dimensions: [packageConst.width, packageConst.height],
      dead: false,
    };
  }

  step: Entity["step"] = (deltaT) => {};

  render: Entity["render"] = (cxt) => {
    cxt.drawImage(
      Textures().ammo,
      0,
      0,
      this.state.dimensions[0],
      this.state.dimensions[1]
    );
  };
}
