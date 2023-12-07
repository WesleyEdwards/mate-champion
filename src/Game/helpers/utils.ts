import { Keys, VagueFacing } from "../models";
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

export const initialKeyStatus: Record<keyof Keys, boolean> = {
  up: false,
  right: false,
  left: false,
  down: false,
  jump: false,
  shoot: false,
  shank: false,
};

export const emptyStats = {
  score: 0,
  lives: 3,
  level: 1,
  ammo: 20,
};

// creating level info from previous implementation
// thing.forEach((element) => {
//   if (element.canMoveBelow) {
//     levelInfo.platforms.push({
//       x: round(element.vector.position.x),
//       y: round(element.vector.position.y),
//       width: round(element.vector.width),
//       height: round(element.vector.height),
//     });
//   } else {
//     levelInfo.floors.push({
//       x: round(element.vector.position.x),
//       y: round(element.vector.position.y),
//       width: round(element.vector.width),
//       height: round(element.vector.height),
//     });
//   }
// });
// return levelInfo;
// };
