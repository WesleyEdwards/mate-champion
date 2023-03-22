import { VagueFacing } from "./models";
import { PlayerDirection } from "./Player/models";

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export function debounceLog(val: any) {
  if (generateRandomInt(0, 150) === 1) {
    console.log(val);
  }
}

export function vagueFacing(facing: PlayerDirection): VagueFacing {
  if (facing === "rightUp" || facing === "leftUp") return "up";
  if (facing === "rightDown" || facing === "leftDown") return "down";
  return facing;
}
