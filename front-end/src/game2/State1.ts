import { addEventListeners } from "../Game/helpers/eventListeners";
import { WinState } from "../Game/helpers/types";
import { Coordinates, FullLevelInfo, Keys } from "../Game/models";
import { Camera } from "./camera";
import { Champ } from "./champ";
import { FloorState, floorConst } from "./floor";
import { PlatformState } from "./platform";
import { emptyCoors, emptyTime } from "./state/helpers";

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
  platforms: PlatformState[];
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
      idleTime: emptyTime(true),
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
      y: "hor",
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
      sprite: emptyTime(true),
      coyote: emptyTime(true),
      actionTimeRemain: emptyTime(false),
      actionCoolDownRemain: emptyTime(false),
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
  platforms: firstLevel.platforms.map((p) => ({
    color: p.color,
    position: { x: p.x, y: p.y },
    widthHeight: { x: p.width, y: p.height },
  })),

  keys: addEventListeners(() => {
    window.pause = true;
    console.log("Paused");
  }),
});
