import { PlayerAction } from "../Game/Player/PlayerVectorManager";
import { Coordinates } from "../Game/models";
import { CurrAndPrev, Entity } from "./state/helpers";
import { TimerDown, TimerUp } from "./state/timeHelpers";

export type Champ = {
  facing: {
    x: ChampDirectionX;
    y: ChampDirectionY;
  };
  jump: {
    jumps: number;
    isJumping: boolean;
  };
  action: "shoot" | "melee" | null;
  render: {
    prev: ChampAssetDes;
    curr: ChampAssetDes;
  };
  gravityFactor: number | null;
  acceptQueue: ChampAction[];
  publishQueue: ChampPublish[];
} & Entity<{
  sprite: TimerUp;
  coyote: TimerUp;
  actionTimeRemain: TimerDown; // Time left and cool down are both decreased always
  actionCoolDownRemain: TimerDown; // When < 0, the player can take another action
}>;

type ChampPublish = {
  name: "shoot";
  initPos: Coordinates;
  velocity: Coordinates;
};

export type ChampAssetDes = ChampDescription | "rising" | "falling";

type DirY = "hor" | "up";

export type ChampDescription = `${DirY}-${PlayerAction}-${"walk" | "none"}`;

export const champConst = {
  widthHeight: {
    x: 64,
    y: 64,
  },
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  melee: {
    time: 250,
    coolDown: 275,
    reach: 120,
  },
  shootCoolDown: 200,
  initPos: { x: 400, y: 400 },
  maxCoyoteTime: 80,
  jumpGravityFactor: 0.9,
  jumpGravityFrameDecrease: 0.93,
  render: {
    walkCycleTime: 70,
    imageWidth: 200,
  },
  gravity: 0.004,
} as const;

export type ChampDirectionY = "up" | "down" | "hor";
export type ChampDirectionX = "left" | "right" | "none";

export type ChampActionStr =
  | "moveX"
  | "stopX"
  | "jump"
  | "melee"
  | "shoot"
  | "setFacingY"
  | "setY";

export type ChampAction =
  | { name: "moveX"; dir: "left" | "right" }
  | { name: "stopX" }
  | { name: "jump" }
  | { name: "melee" }
  | { name: "shoot" }
  | { name: "jump" }
  | { name: "setFacingY"; dir: ChampDirectionY }
  | { name: "setY"; y: number };

export type PossibleActionToChamp<T extends ChampActionStr> = T extends "moveX"
  ? { name: "moveX"; dir: "left" | "right" }
  : T extends "jump"
  ? { name: "jump" }
  : T extends "stopX"
  ? { name: "stopX" }
  : T extends "melee"
  ? { name: "melee" }
  : T extends "shoot"
  ? { name: "shoot" }
  : T extends "setFacingY"
  ? { name: "setFacingY"; dir: ChampDirectionY }
  : T extends "setY"
  ? { name: "setY"; y: number }
  : never;
