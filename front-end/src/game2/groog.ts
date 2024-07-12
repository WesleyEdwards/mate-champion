import { Coordinates } from "../Game/models";
import { CurrAndPrev, Entity } from "./state/helpers";
import { TimerDown, TimerUp } from "./state/timeHelpers";

export type Groog = {
  facing: "left" | "right";
  render: {
    curr: GroogAssetDes;
  };
  queueActions: GroogAction[];
} & Entity<{
  sprite: TimerUp;
  actionTimeRemain: TimerDown; // right now, just dying
}>;

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
  dieTimer: 500,
} as const;

export type GroogAssetDes = "walk" | "die" | "rising" | "falling";

type GroogDirX = "left" | "right";

export type GroogAction =
  | { name: "die" }
  | { name: "jump" }
  | { name: "setX"; dir: GroogDirX }
  | { name: "setY"; y: number };
