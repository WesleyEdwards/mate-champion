import { createId, generateRandomInt } from "../loopShared/utils";
import { Coordinates } from "../loopShared/models";
import { Textures } from "../../gameAssets/textures";
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

export class Platform implements Entity {
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
    cxt.lineWidth = 4;

    const reduceSize = 2;

    cxt.fillRect(0, 0, this.state.dimensions[0], this.state.dimensions[1]);
    cxt.strokeRect(
      reduceSize,
      reduceSize,
      this.state.dimensions[0] - reduceSize * 2,
      this.state.dimensions[1] - reduceSize * 2
    );
  };
}

export class Floor implements Entity {
  id = createId();
  typeId = "floor" as const;
  state: PlatformState;

  constructor(s: PlatformState) {
    this.state = s;
  }
  step: Entity["step"] = (deltaT) => {};

  render: Entity["render"] = (cxt) => {
    const img = Textures().platform;
    const blocksNeeded = Math.ceil(this.state.dimensions[0] / img.width);
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
      );
    }
  };
}
