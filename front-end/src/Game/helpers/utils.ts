import { Id } from "../../game2/entities/entityTypes";

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export const emptyStats = {
  score: 0,
  lives: 3,
  level: 1,
  ammo: 20,
  levelCreator: "",
};

export function createId(type?: string): Id {
  return `${type}-${generateRandomInt(0, 10000)}`;
}
