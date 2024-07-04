/**
 * player
 */

import { CurrentChampAction } from "../Game/Player/Player";
import { PlayerDescription } from "../Game/Player/PlayerSpriteInfo";
import {
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
  action: {
    curr: CurrentChampAction | null;
    // prev: PlayerDescription;
  };
  timer: {
    coyoteTime: number;
    spriteTimer: number;
  };
  render: {
    prev: ChampAssetDes;
    curr: ChampAssetDes;
  };
  gravityFactor: number | null;
};

export type ChampAssetDes = PlayerDescription | "rising" | "falling";

export const champConst = {
  width: 64,
  height: 64,
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  shankTime: 250,
  meleeCoolDown: 275,
  meleeReach: 120,
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
  | { setY: number };
