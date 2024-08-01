import { GrogProps } from "./Opponent/Grog";
import { FloatingType, FloorType } from "./Platform/Platform";
import { Canvas, DrawObjProps, PlayStats } from "./helpers/types";

export type PackageProps = {
  x: number;
  y: number;
};

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
  handleLose: (score: number) => void;
  handlePause: (pause: boolean) => void;
}

export interface HasPosition {
  vector: VectorMan;
}

export interface VectorMan {
  position: Coordinates;
  width: number;
  height: number;
  setPosX: (newX: number) => void;
  setPosY: (newY: number) => void;
  relativePos: (xOffset: number) => Coordinates;
}

export interface CharVectorMan extends VectorMan {
  velocity: Coordinates;
  prevPosX: number;
  prevPosY: number;
}

export interface Character {
  vector: CharVectorMan;
  move: (action: CharAction) => void;
  setOnPlatform: (newY: number) => void;
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
  mostRecentX: "left" | "right";
}

export type OppDirections = "left" | "right";

export type VagueFacing = "left" | "right" | "up" | "down";

export type LevelMap = {
  _id: string;
  endPosition: number;
  packages: PackageProps[];
  opponents: { grog: GrogProps[] };
  platforms: FloatingType[];
  floors: FloorType[];
  createdAt: string;
  updatedAt: string;
};

export type LevelInfo = {
  _id: string;
  description: string | null | undefined;
  owner: string;
  public: boolean;
  creatorName: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type FullLevelInfo = LevelMap & LevelInfo;
