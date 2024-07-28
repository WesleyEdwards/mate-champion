import { generateRandomInt } from "../Game/helpers/utils";
import { Coordinates } from "../Game/models";
import { GroogState } from "./groog";
import { Coors, CurrAndPrev } from "./state/helpers";
import { Entity } from "./State1";

export type PlatformState = {
  color: string;
  position: CurrAndPrev;
  dead: boolean;
  dimensions: Coors;
};

export class Platform1 implements Entity {
  id = generateRandomInt(0, 12345);
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
  id = generateRandomInt(0, 12345);
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
