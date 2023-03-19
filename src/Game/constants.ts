import { Keys } from "./models";

export const MAX_CANVAS_WIDTH = 1024;
export const MAX_CANVAS_HEIGHT = 576;

export const DISPLAY_LEVEL_TIME = 2000;

export const GRAVITY = 0.65;

export const PLAT_FREQUENCY = 350;

export const NUM_PLATFORMS = 30;
export const END_POS = 1000;
// export const END_POS = 4500;

export const INCREMENT_VALUE = 5;

// Opponent
export const oppPerLevel = 5;
export const oppSpeedBase = 2;

// Player
export const playerConstants = {
  shankTime: 200,
  shankCoolDown: 250,
  shootCoolDown: 150,
  radius: 25,
  moveSpeed: 10,
};

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

export const packageWorth = 5;

export const emptyStats = {
  score: 0,
  lives: 3,
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
];

export const BULLET_RADIUS = 15;
export const BULLET_SPEED = 0.7;

export type winState = "lose" | "playing" | "initial" | "nextLevel";
