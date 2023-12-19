import { Canvas, DrawObjProps, PlayStats } from "./helpers/types";

export type CharAction =
  | "MoveRight"
  | "MoveLeft"
  | "Jump"
  | "Duck"
  | "StopX"
  | "StopY";

export interface Coordinates {
  x: number;
  y: number;
}

export interface SetUI {
  modifyStats: (stats: Partial<PlayStats>) => void;
  handleLose: () => void;
}

export interface HasPosition {
  vector: VectorMan;
}

export interface VectorMan {
  position: Coordinates;
  bottomPos: number;
  rightPos: number;
  width: number;
  height: number;
  posX: number;
  posY: number;
  setPosX: (newX: number) => void;
  setPosY: (newY: number) => void;
  posCenter: Coordinates;
  relativePos: (xOffset: number) => Coordinates;
}

export interface CharVectorMan extends VectorMan {
  velocity: Coordinates;
  prevPosX: number;
  prevPosY: number;
  isMovingDown: boolean;
}

export interface Character {
  vector: CharVectorMan;
  facing: VagueFacing;
  move: (action: CharAction) => void;
  setPosY: (newY: number) => void;
}

export interface StaticObject extends HasPosition {
  draw: (drawProps: DrawObjProps) => void;
  isFloor: boolean;
  color: string;
}

export interface Keys {
  up: boolean;
  right: boolean;
  left: boolean;
  down: boolean;
  jump: boolean;
  shoot: boolean;
  shank: boolean;
  toJump: 0 | 1;
  toShoot: 0 | 1;
  toShank: 0 | 1;
}

export type OppDirections = "left" | "right";

export type VagueFacing = "left" | "right" | "up" | "down";
