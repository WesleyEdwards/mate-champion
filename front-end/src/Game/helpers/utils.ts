import { devSettings } from "../devSettings";
import { VagueFacing } from "../models";
import { PlayerDirection } from "../Player/models";

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export function debounceLog(val: any, log?: any) {
  if (generateRandomInt(0, 150) === 1) {
    console.log(val, log);
  }
}

export function vagueFacing(facing: PlayerDirection): VagueFacing {
  if (facing === "rightUp" || facing === "leftUp") return "up";
  if (facing === "rightDown" || facing === "leftDown") return "down";
  return facing;
}

export const emptyStats = {
  score: 0,
  lives: devSettings.oneLife ? 1 : 3,
  level: 1,
  ammo: 20,
};
