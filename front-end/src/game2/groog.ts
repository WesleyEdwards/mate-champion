import { Coordinates } from "../Game/models";
import { Timer } from "./champ";
import { CurrAndPrev } from "./state/helpers";

export type Groog = {
  position: CurrAndPrev;
  velocity: Coordinates;
  facing: "left" | "right";
  timer: {
    sprite: Timer;
    // right now, just dying
    actionTimeRemain: Timer;
  };
  render: {
    curr: GroogAssetDes;
  };
  queueActions: GroogAction[];
};

export const groogConst = {
  render: {
    width: 90,
    height: 90,
  },
  distFromChampMelee: 10,
  jumpSpeed: -1,
} as const;

type GroogAction = "die" | "jump" | { setXDir: "left" | "right" };

export type GroogAssetDes = "walk" | "die" | "rising" | "falling";
