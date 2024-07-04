/**
 * player
 */

import { CurrentChampAction } from "../Game/Player/Player";
import { PlayerDescription } from "../Game/Player/PlayerSpriteInfo";
import {
  PlayerDirectionX,
  PlayerDirectionY,
} from "../Game/Player/PlayerVectorManager";
import { CharAction } from "../Game/models";
import { CurrAndPrev } from "./state/helpers";

export type PlayerState = {
  queueActions: CharAction[];
  // stoppedY: boolean;
  facing: {
    x: PlayerDirectionX;
    y: PlayerDirectionY;
  };
  jumps: number;
  velocity: CurrAndPrev;
  position: CurrAndPrev;
  action: {
    curr: CurrentChampAction | null;
    prev: PlayerDescription;
  };
  timer: {
    coyoteTime: number;
    spriteTimer: number;
  };
  gravityFactor: number | null;
};
