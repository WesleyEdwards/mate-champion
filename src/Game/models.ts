export type PlayerAction =
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
  setDisabledPlay: (disabled: boolean) => void;
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
  move: (action: PlayerAction) => void;
}

export interface Keys {
  up: boolean;
  right: boolean;
  left: boolean;
  space: boolean;
}

export interface GameStats {
  level: number;
  score: number;
  lives: number;
}

export interface PlayerScore {
  name: string;
  score: number;
}
