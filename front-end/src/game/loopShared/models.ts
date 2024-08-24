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
  draw: (drawProps: any) => void;
  isFloor: boolean;
  color: string;
}

export type GrogProps = {
  initPos: Coordinates;
  moveSpeed: number;
  jumpOften?: boolean;
};

export type FloorType = {
  x: number;
  width: number;
  color: string;
};

export type FloatingType = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

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