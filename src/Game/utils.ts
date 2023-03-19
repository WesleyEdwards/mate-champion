import { MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT } from "./constants";
import { ObjectManager } from "./GameState/ObjectManager";
import { VagueFacing } from "./models";
import { PlayerDirection } from "./Player/models";

export function drawEverything(
  context: CanvasRenderingContext2D,
  objects: ObjectManager
) {
  const { platforms, opponents, player, pot } = objects;

  context.fillStyle = "white";
  context.fillRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);

  platforms.forEach((plat) => plat.draw(context));
  opponents.forEach((opponent) => opponent.draw(context));
  player.draw(context);

  pot.draw();
}

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export function debounceLog(val: any) {
  if (generateRandomInt(0, 50) === 1) {
    console.log(val);
  }
}

export function vagueFacing(facing: PlayerDirection): VagueFacing {
  if (facing === "rightUp" || facing === "leftUp") return "up";
  if (facing === "rightDown" || facing === "leftDown") return "down";
  return facing;
}
