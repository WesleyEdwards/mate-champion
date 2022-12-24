import { Keys } from "./models";

export const MAX_CANVAS_WIDTH = 1024;
export const MAX_CANVAS_HEIGHT = 576;

export const GRAVITY = 0.65;

export const PLAT_FREQUENCY = 350;

export const NUM_PLATFORMS = 30;
// export const END_POS = 1000;
export const END_POS = 4500;

export const INCREMENT_VALUE = 5;

// Opponent
export const oppPerLevel = 5;
export const oppSpeedBase = 2;

// Player
export const playerConstants = {
  shankTime: 200,
  shankCoolDown: 100,
  radius: 25,
  moveSpeed: 10,
};

export const initialKeyStatus: Record<keyof Keys, boolean> = {
  up: false,
  right: false,
  left: false,
  space: false,
};

export const emptyStats = {
  score: 0,
  lives: 1,
  level: 1,
};

export const listOfColors = [
  "green",
  "red",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
];
