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

export interface hasPosition {
  position: Coordinates;
}

export interface Character {
  position: Coordinates;
  velocity: Coordinates;
  bottomPos: number;
  rightPos: number;
  height: number;
  move: (action: CharAction) => void;
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
