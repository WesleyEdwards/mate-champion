import { Keys } from "./models";

export const MAX_CANVAS_WIDTH = 1024;
export const MAX_CANVAS_HEIGHT = 576;

export const DISPLAY_LEVEL_TIME = 250;
// export const DISPLAY_LEVEL_TIME = 2000;

export const GRAVITY = 0.0025;

export const PLAT_FREQUENCY = 350;

// export const END_POS = 1000;
export const END_POS = 4500;

export const INCREMENT_VALUE = 5;

// Opponent
export const OPP_PER_LEVEL = 0;
// export const OPP_PER_LEVEL = 5;

export const playerConst = {
  radius: 32,
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  shankTime: 200,
  shankCoolDown: 250,
  shootCoolDown: 150,
  initPos: { x: 100, y: 10 },
} as const;

export const opponentConst = {
  radius: 32,
  speedBase: 0.05,
  jumpSpeed: -0.8,
} as const;

export const packageConst = { worth: 3 } as const;
export const bulletConst = { radius: 15, speed: 0.7 } as const;

// export const firebaseCollection = "scores";
export const firebaseCollection = "scores-test";
