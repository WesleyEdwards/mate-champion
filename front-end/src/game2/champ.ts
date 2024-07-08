/**
 * player
 */

import { CurrentChampAction } from "../Game/Player/Player";
import { PlayerDescription } from "../Game/Player/PlayerSpriteInfo";
import {
  PlayerAction,
  PlayerDirectionX,
  PlayerDirectionY,
  PlayerMove,
} from "../Game/Player/PlayerVectorManager";
import { Coordinates } from "../Game/models";
import { CurrAndPrev } from "./state/helpers";

export type Champ = {
  facing: {
    x: ChampDirectionX;
    y: ChampDirectionY;
  };
  jump: {
    jumps: number;
    isJumping: boolean;
  };
  velocity: Coordinates;
  position: CurrAndPrev;
  action: "shoot" | "melee" | null;
  timer: {
    sprite: Timer;
    coyote: Timer;
    actionTimeRemain: Timer; // Time left and cool down are both decreased always
    actionCoolDownRemain: Timer; // When < 0, the player can take another action
  };
  render: {
    prev: ChampAssetDes;
    curr: ChampAssetDes;
  };
  gravityFactor: number | null;
  queueActions: ChampAction[];
};

export type Timer = { countUp: boolean; val: number };

export type ChampAssetDes = ChampDescription | "rising" | "falling";

type DirY = "hor" | "up";

export type ChampDescription = `${DirY}-${PlayerAction}-${"walk" | "none"}`;

export const champConst = {
  width: 64,
  height: 64,
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

export type PossibleAction =
  | "moveX"
  | "stopX"
  | "jump"
  | "melee"
  | "setFacingY"
  | "setY";

export type ChampAction =
  | { name: "moveX"; dir: "left" | "right" }
  | { name: "stopX" }
  | { name: "jump" }
  | { name: "melee" }
  | { name: "jump" }
  | { name: "setFacingY"; dir: ChampDirectionY }
  | { name: "setY"; y: number };

export type PossibleActionToChamp<T extends PossibleAction> = T extends "moveX"
  ? { name: "moveX"; dir: "left" | "right" }
  : T extends "jump"
  ? { name: "jump" }
  : T extends "stopX"
  ? { name: "stopX" }
  : T extends "melee"
  ? { name: "melee" }
  : T extends "setFacingY"
  ? { name: "setFacingY"; dir: ChampDirectionY }
  : T extends "setY"
  ? { name: "setY"; y: number }
  : never;
