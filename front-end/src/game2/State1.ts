import { addEventListeners } from "../Game/helpers/eventListeners";
import { WinState } from "../Game/helpers/types";
import { Coordinates, FullLevelInfo, Keys } from "../Game/models";
import { Camera } from "./camera";
import { Champ } from "./champ";
import { emptyCoors } from "./state/helpers";

export type GameState1 = {
  currStateOfGame: WinState;
  camera: Camera;
  time: {
    deltaT: number;
    prevStamp: number;
  };
  stats: {
    score: number;
  };
  player: Champ;
  keys: Keys;
};

export const initGameState = ({
  levels,
}: {
  levels: FullLevelInfo[];
}): GameState1 => {
  return {
    currStateOfGame: "initial",
    camera: {
      position: emptyCoors(),
      velocity: emptyCoors(),
      time: {
        idleTime: 0,
      },
    },
    time: {
      deltaT: 0,
      prevStamp: performance.now(),
    },
    stats: {
      score: 0,
    },
    player: {
      queueActions: [],
      facing: {
        x: "right",
        y: "none",
      },
      gravityFactor: null,
      jump: { jumps: 0, isJumping: false },
      position: {
        curr: { x: 400, y: 400 },
        prev: emptyCoors(),
      },
      velocity: {
        curr: emptyCoors(),
        prev: emptyCoors(),
      },
      action: {
        curr: null,
        prev: "none-none-none",
      },
      timer: {
        spriteTimer: 0,
        coyoteTime: 0,
      },
    },
    keys: addEventListeners(() => {}),
  };
};
