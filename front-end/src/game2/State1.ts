import { addEventListeners } from "../Game/helpers/eventListeners";
import { WinState } from "../Game/helpers/types";
import { Coordinates, FullLevelInfo, Keys } from "../Game/models";
import { PlayerState } from "./champ";

export type GameState1 = {
  currStateOfGame: WinState;
  cameraOffset: Coordinates;
  time: {
    deltaT: number;
    prevStamp: number;
  };
  stats: {
    score: number;
  };
  player: PlayerState;
  keys: Keys;
};

export const initGameState = ({
  levels,
}: {
  levels: FullLevelInfo[];
}): GameState1 => {
  return {
    currStateOfGame: "initial",
    cameraOffset: emptyCoors(),
    time: {
      deltaT: 0,
      prevStamp: 0,
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
      jumps: 0,
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

const emptyCoors = (): Coordinates => {
  return { x: 0, y: 0 };
};
