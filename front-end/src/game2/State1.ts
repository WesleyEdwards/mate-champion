import { addEventListeners } from "../Game/helpers/eventListeners";
import { WinState } from "../Game/helpers/types";
import { FullLevelInfo, Keys } from "../Game/models";
import { MBullet } from "./bullet";
import { Camera } from "./camera";
import { Champ } from "./champ";
import { FloorState, floorConst } from "./floor";
import { Groog, groogConst } from "./groog";
import { PlatformState } from "./platform";
import { emptyCoors } from "./state/helpers";
import { emptyTime } from "./state/timeHelpers";

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
  grogs: Groog[];
  bullets: MBullet[];
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
      idleTime: emptyTime("up"),
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
    velocity: emptyCoors(),
    action: null,
    timers: {
      sprite: emptyTime("up"),
      coyote: emptyTime("up"),
      actionTimeRemain: emptyTime("down"),
      actionCoolDownRemain: emptyTime("down"),
    },
    render: {
      prev: "falling",
      curr: "falling",
    },
    acceptQueue: [],
    publishQueue: [],
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
  grogs: firstLevel.opponents.grog.map((g) => ({
    velocity: { x: g.moveSpeed, y: 0 },
    position: {
      curr: { ...g.initPos },
      prev: emptyCoors(),
    },
    facing: "right",
    render: {
      curr: "walk",
    },
    timers: {
      sprite: emptyTime("up"),
      actionTimeRemain: emptyTime("down"),
    },
    queueActions: [],
  })),
  bullets: [],

  keys: addEventListeners(() => {
    window.pause = !window.pause;
    console.log("Paused", window.pause);
  }),
});
