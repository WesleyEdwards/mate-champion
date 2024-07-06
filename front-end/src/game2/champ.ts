/**
 * player
 */

import { CurrentChampAction } from "../Game/Player/Player";
import { PlayerDescription } from "../Game/Player/PlayerSpriteInfo";
import {
  PlayerAction,
  PlayerDirectionX,
  PlayerDirectionY,
} from "../Game/Player/PlayerVectorManager";
import { CurrAndPrev } from "./state/helpers";

export type Champ = {
  queueActions: ChampAction[];
  // stoppedY: boolean;
  facing: {
    x: PlayerDirectionX;
    y: PlayerDirectionY;
  };
  jump: {
    jumps: number;
    isJumping: boolean;
  };
  velocity: CurrAndPrev;
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
};

export type Timer = { countUp: boolean; val: number };

export type ChampAssetDes = PlayerDescription | "rising" | "falling";

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

export type ChampAction =
  | "MoveRight"
  | "MoveLeft"
  | "Jump"
  | "Duck"
  | "StopX"
  | "Melee"
  | { setY: number };
