import { devSettings } from "../devSettings";
import { VagueFacing } from "../models";

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export function debounceLog(val: any, log?: any) {
  if (generateRandomInt(0, 10) === 1) {
    console.log(val, log);
  }
}

export const emptyStats = {
  score: 0,
  lives: devSettings.oneLife ? 1 : 3,
  level: 1,
  ammo: devSettings.unlimitedBullets ? 9000 : 20,
};
