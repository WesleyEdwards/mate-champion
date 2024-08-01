import { createId } from "../Game/helpers/utils";
import { Textures } from "../gameAssets/textures";
import { Coors, CurrAndPrev, Entity } from "./entityTypes";
import { toCurrAndPrev } from "./helpers";

type EndGateState = {
  position: CurrAndPrev;
  dimensions: Coors;
  dead: boolean;
};

export class EndGate implements Entity {
  id = createId();
  typeId = "endGate" as const;
  state: EndGateState;

  constructor(pos: Coors) {
    this.state = {
      position: toCurrAndPrev(pos),
      dimensions: [100, 100],
      dead: false,
    };
  }

  step: Entity["step"] = (deltaT) => {};

  render: Entity["render"] = (cxt) => {
    cxt.scale(2.52, 2.52);
    cxt.drawImage(Textures().endGate, -60, 0);
  };
}
