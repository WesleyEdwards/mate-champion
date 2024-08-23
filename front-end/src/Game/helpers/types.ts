import { Coordinates } from "../models";

export type WinState =
  | "lose"
  | "playing"
  | "initial"
  | "nextLevel"
  | "loseLife";

export type PlayStats = {
  score: number;
  lives: number;
  level: number;
  ammo: number;
};
