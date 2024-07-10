import { Coordinates } from "../Game/models";
import { Timer } from "./champ";
import { CurrAndPrev } from "./state/helpers";

export type Groog = {
  position: CurrAndPrev;
  velocity: Coordinates;
  facing: "left" | "right";
  timer: {
    sprite: Timer;
    actionTimeRemain: Timer; // right now, just dying
  };
  render: {
    curr: GroogAssetDes;
  };
  queueActions: GroogAction[];
};

export const groogConst = {
  widthHeight: {
    x: 80,
    y: 80,
  },
  render: {
    imageWidth: 75,
  },
  distFromChampMelee: 10,
  jumpSpeed: -1,
  dieTimer: 1000,
} as const;

export type GroogAssetDes = "walk" | "die" | "rising" | "falling";

type GroogDirX = "left" | "right";

export type GroogActionStr = "die" | "jump" | "setX" | "setY";

export type GroogAction =
  | { name: "die" }
  | { name: "jump" }
  | { name: "setX"; dir: GroogDirX }
  | { name: "setY"; y: number };

export type PossibleActionToGroog<T extends GroogActionStr> = T extends "die"
  ? { name: "die" }
  : T extends "jump"
  ? { name: "jump" }
  : T extends "setX"
  ? { name: "setX"; dir: GroogDirX }
  : T extends "setY"
  ? { name: "setY"; y: number }
  : never;
