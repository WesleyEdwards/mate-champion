import { Keys } from "./models";

export const MAX_CANVAS_WIDTH = 1024;
export const MAX_CANVAS_HEIGHT = 576;

export const DISPLAY_LEVEL_TIME = 2000;

export const GRAVITY = 0.0025;

export const PLAT_FREQUENCY = 350;

export const NUM_PLATFORMS = 30;
// export const END_POS = 1000;
export const END_POS = 4500;

export const INCREMENT_VALUE = 5;

// Opponent
export const OPP_PER_LEVEL = 5;
export const OPP_SPEED_BASE = 0.05;
export const OPP_JUMP_SPEED = -0.8;

// Player
export const PLAYER_RADIUS = 25;
export const PLAYER_MOVE_SPEED = 0.5;
export const PLAYER_JUMP_SPEED = -0.85;
export const SHANK_TIME = 200;
export const SHANK_COOL_DOWN = 250;
export const SHOOT_COOL_DOWN = 150;
export const PLAYER_INIT_POS = { x: 100, y: 99 };

export const oppConstants = {
  radius: 25,
  baseMoveSpeed: 2,
};

export const initialKeyStatus: Record<keyof Keys, boolean> = {
  up: false,
  right: false,
  left: false,
  down: false,
  jump: false,
  shoot: false,
  shank: false,
};

export const PACKAGE_WORTH = 3;

export const emptyStats: PlayStats = {
  score: 0,
  lives: 1,
  level: 1,
  ammo: 50,
};

export const firebaseCollection = "scores-test";

// export const emptyStats = {
//   score: 0,
//   lives: 3,
//   level: 1,
//   ammo: 20,
// };

// export const firebaseCollection = "scores";

export const listOfColors = [
  "springgreen",
  "red",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
] as const;

export const BULLET_RADIUS = 15;
export const BULLET_SPEED = 0.7;

export type winState =
  | "lose"
  | "playing"
  | "initial"
  | "nextLevel"
  | "loseLife";

export type StatsManagerInfo = {
  killedOpp: number;
  packagesReceived: boolean;
  moveScreenLeft: boolean;
  moveScreenRight: boolean;
  shot: boolean;
};

export type LevelInfo = {
  isCaught: boolean;
  nextLevel: boolean;
};

export type UpdateStatus = {
  statsInfo: StatsManagerInfo;
  levelInfo: LevelInfo;
};

export type PlayStats = {
  score: number;
  lives: number;
  level: number;
  ammo: number;
};