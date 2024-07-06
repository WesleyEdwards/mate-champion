import { addEventListeners } from "../Game/helpers/eventListeners";
import { WinState } from "../Game/helpers/types";
import { Coordinates, FullLevelInfo, Keys } from "../Game/models";
import { Camera } from "./camera";
import { Champ } from "./champ";
import { FloorState, floorConst } from "./floor";
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
  floors: FloorState[];
  keys: Keys;
};

export const initGameState = ({
  firstLevel,
}: {
  firstLevel: FullLevelInfo;
}): GameState1 => ({
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
    action: null,
    timer: {
      sprite: { countUp: true, val: 0 },
      coyote: { countUp: true, val: 0 },
      actionTimeRemain: { countUp: false, val: 0 },
      actionCoolDownRemain: { countUp: false, val: 0 },
    },
    render: {
      prev: "falling",
      curr: "falling",
    },
  },
  floors: firstLevel.floors.map((f) => ({
    color: f.color,
    position: { x: f.x, y: floorConst.floorY },
    widthHeight: { x: f.width, y: floorConst.floorHeight },
  })),
  keys: addEventListeners(() => {
    window.pause = true;
    console.log("Paused");
  }),
});
