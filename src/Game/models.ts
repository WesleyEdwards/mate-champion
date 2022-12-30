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
  setLevel: (level: number) => void;
  setLives: (lives: number | undefined) => void;
  setScore: (score: number) => void;
  setAmmo: (ammo: number) => void;
  setDisabledPlay: (disabled: boolean) => void;
  setShowInstructions: (show: boolean) => void;
  setShowHighScoreDiv: (score: number | undefined) => void;
}

export interface HasPosition {
  position: Coordinates;
  posCenter: Coordinates;
}

export interface Character extends HasPosition {
  velocity: Coordinates;
  bottomPos: number;
  rightPos: number;
  height: number;
  moveDown: boolean
  move: (action: CharAction) => void;
  setPosY: (newY: number) => void;
}

export interface Keys {
  up: boolean;
  right: boolean;
  left: boolean;
  down: boolean;
  jump: boolean;
  shoot: boolean;
  shank: boolean;
}

export interface GameStats {
  level: number;
  score: number;
  lives: number;
  ammo: number;
}

export interface PlayerScore {
  name: string;
  score: number;
}

export type OppDirections = "left" | "right";

export type VagueFacing = "left" | "right" | "up";
