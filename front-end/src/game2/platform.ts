import { createId, generateRandomInt } from "../Game/helpers/utils";
import { Coordinates } from "../Game/models";
import { Coors, CurrAndPrev, Entity } from "./entityTypes";
import { GroogState } from "./groog";

export type PlatformState = {
  color: string;
  position: CurrAndPrev;
  dead: boolean;
  dimensions: Coors;
};

export class Platform1 implements Entity {
  id = createId();
  typeId = "platform" as const;
  state: PlatformState;

  constructor(s: PlatformState) {
    this.state = s;
  }

  step: Entity["step"] = (deltaT) => {};

  render: Entity["render"] = (cxt) => {
    cxt.fillStyle = this.state.color;
    cxt.strokeStyle = "black";
    cxt.lineWidth = 8;

    cxt.strokeRect(0, 0, this.state.dimensions[0], this.state.dimensions[1]);
    cxt.fillRect(0, 0, this.state.dimensions[0], this.state.dimensions[1]);
  };
}

export class Floor1 implements Entity {
  id = createId();
  typeId = "floor" as const;
  state: PlatformState;

  constructor(s: PlatformState) {
    this.state = s;
  }
  step: Entity["step"] = (deltaT) => {};

  render: Entity["render"] = (cxt) => {
    cxt.fillStyle = this.state.color;
    cxt.strokeStyle = "black";
    cxt.lineWidth = 8;

    cxt.strokeRect(0, 0, this.state.dimensions[0], this.state.dimensions[1]);
    cxt.fillRect(0, 0, this.state.dimensions[0], this.state.dimensions[1]);
  };
}
