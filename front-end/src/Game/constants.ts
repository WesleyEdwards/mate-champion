import { devSettings } from "./devSettings";

export const MAX_CANVAS_HEIGHT = 576;
export const MAX_CANVAS_WIDTH = MAX_CANVAS_HEIGHT * 1.777777777777778;

export const DISPLAY_LEVEL_TIME = devSettings.shortLevelScreen ? 100 : 2000;

// export const GRAVITY = 0.001;
export const GRAVITY = 0.004;

export const END_POS = 4500;

export const playerConst = {
  radius: 32,
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  shankTime: 300,
  shankCoolDown: 275,
  shootCoolDown: 150,
  initPos: { x: 400, y: 400 },
  maxCoyoteTime: 100,
  jumpGravityFactor: 0.9,
  jumpGravityFrameDecrease: 0.93,
} as const;

export const cameraConst = {
  idealDistFromLeftWall: 400,
  idealMinDistFromCeiling: 290,
};

export const grogConst = {
  width: 64,
  height: 64,
  jumpSpeed: -1,
} as const;

export const packageConst = { width: 60, height: 75, worth: 3 } as const;

export const bulletConst = {
  width: 28 * 1.5,
  height: 12 * 2,
  speed: 0.2,
  // speed: 0.9,
  distFromPlayerDud: 800,
  distFromOppHit: 40,
} as const;

export const platformConst = {
  floorY: 530,
  floorHeight: 60,
} as const;

export const firebaseCollection = devSettings.sandboxDb
  ? "scores-test-1"
  : "scores";
