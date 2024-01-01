import { Coordinates } from "../models";

export type WinState =
  | "lose"
  | "playing"
  | "initial"
  | "nextLevel"
  | "loseLife";

export type StatsManagerInfo = {
  killedOpp: number;
  packagesReceived: boolean;
  // moveScreenLeft: boolean;
  // moveScreenRight: boolean;
  shot: boolean;
};

export type UpdateStatus = {
  statsInfo: StatsManagerInfo;
  levelInfo: {
    isCaught: boolean;
    nextLevel: boolean;
  };
};

export type PlayStats = {
  score: number;
  lives: number;
  level: number;
  ammo: number;
};

export type Canvas = CanvasRenderingContext2D;

export type DrawObjProps = {
  cxt: Canvas;
  camOffset: Coordinates;
};