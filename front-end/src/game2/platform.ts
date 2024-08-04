import { createId, generateRandomInt } from "../Game/helpers/utils";
import { Coordinates } from "../Game/models";
import { Coors, CurrAndPrev, Entity } from "./entityTypes";
import { GroogState } from "./groog";

export const floorConst = {
  floorY: 530,
  floorHeight: 60,
} as const;

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
    renderFloorOrPlat(cxt, this);
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
    renderFloorOrPlat(cxt, this);
  };
}

const renderFloorOrPlat = (
  cxt: CanvasRenderingContext2D,
  floor: Floor1 | Platform1
) => {
  cxt.fillStyle = floor.state.color;
  cxt.strokeStyle = "black";
  cxt.lineWidth = 4;

  const reduceSize = 2;

  cxt.fillRect(0, 0, floor.state.dimensions[0], floor.state.dimensions[1]);
  cxt.strokeRect(
    reduceSize,
    reduceSize,
    floor.state.dimensions[0] - reduceSize * 2,
    floor.state.dimensions[1] - reduceSize * 2
  );
};
