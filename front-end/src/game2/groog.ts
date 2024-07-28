import { Coordinates } from "../Game/models";
import { calcPlatEntityCollision } from "./interactions";
import { renderGroog } from "./render/groog";
import { accountForPosition } from "./render/helpers";
import { updateGroog } from "./state/groog";
import { Coors, CurrAndPrev } from "./state/helpers";
import {
  emptyTime,
  TimerDown,
  TimerUp,
  updatePosAndVel,
  updateTimers,
} from "./state/timeHelpers";
import { Entity } from "./State1";

export type GroogState = {
  facing: "left" | "right";
  position: CurrAndPrev;
  velocity: Coors;
  dimensions: Coors;
  dead: boolean;
  timers: {
    sprite: TimerUp;
    actionTimeRemain: TimerDown; // right now, just dying
  };
  render: {
    curr: GroogAssetDes;
  };
  queueActions: GroogAction[];
};

export const groogConst = {
  dimensions: [80, 80],
  render: {
    imageWidth: 75,
  },
  distFromChampMelee: 10,
  jumpSpeed: -1,
  dieTimer: 500,
} as const;

export type GroogAssetDes = "walk" | "die" | "rising" | "falling";

type GroogDirX = "left" | "right";

export type GroogAction =
  | { name: "die" }
  | { name: "jump" }
  | { name: "setX"; dir: GroogDirX }
  | { name: "setY"; y: number };

export class Groog1 implements Entity {
  id = 42;
  typeId = "player" as const;
  state: GroogState;
  constructor(position: Coors, velocity: Coors) {
    this.state = {
      facing: "right",
      position: { curr: [...position], prev: [...position] },
      velocity,
      dimensions: [...groogConst.dimensions],
      dead: false,
      timers: {
        sprite: emptyTime("up"),
        actionTimeRemain: emptyTime("down"), // right now, just dying
      },
      render: {
        curr: "walk",
      },
      queueActions: [],
    };
  }

  step: Entity["step"] = (deltaT) => {
    updateTimers(this.state.timers, deltaT);
    updatePosAndVel(this.state.position, this.state.velocity, deltaT);
    updateGroog(this.state, deltaT);
  };

  render: Entity["render"] = (cxt) => {
    accountForPosition(this.state.position, cxt);
    renderGroog(this.state, cxt);
  };

  handleInteraction: Entity["handleInteraction"] = (entities) => {
    for (const entity of entities) {
      if (entity.typeId === "floor" || entity.typeId === "platform") {
        const y = calcPlatEntityCollision(this, entity);
        if (y !== null) {
          this.state.queueActions.push({ name: "setY", y });
        }
      }
    }
  };
}
