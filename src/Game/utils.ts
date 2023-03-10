import {
  listOfColors,
  NUM_PLATFORMS,
  END_POS,
  oppSpeedBase,
  oppPerLevel,
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
} from "./constants";
import { ObjectManager } from "./GameState/ObjectManager";
import { StaticObject, VagueFacing } from "./models";
import { Opponent } from "./Opponent/Opponent";
import { Package } from "./Bullet/Package";
import { Floor } from "./Platform/Floor";
import { Platform } from "./Platform/Platform";
import { PlayerDirection } from "./Player/models";

export function createBlocks(level: number): StaticObject[] {
  const blocks = createPlatforms(level);
  blocks.push(...createFloor(level));
  return blocks;
}

function createPlatforms(level: number): Platform[] {
  const platColor = listOfColors[(level - 1) % listOfColors.length];
  const plats = new Array(NUM_PLATFORMS).fill(null).map((_, i) => {
    const sectionY = i % 2 === 0 ? "top" : "middle";
    return new Platform(END_POS - i * 150, sectionY, platColor);
  });
  return plats.concat(
    new Platform(END_POS - NUM_PLATFORMS * 150, "top", platColor, true)
  );
}

function createFloor(level: number): Floor[] {
  let temp = END_POS + 2000;
  const list: Floor[] = [];
  while (temp > -1000) {
    const width = generateRandomInt(650, 900);
    list.push(new Floor(temp, width));
    temp -= 1000;
  }
  return list;
}

export function createOpponents(level: number): Opponent[] {
  const moveSpeed = oppSpeedBase + level * 0.3;
  return new Array(oppPerLevel * level)
    .fill(null)
    .map(() => new Opponent(generateRandomInt(500, END_POS), moveSpeed));
}
export function createMatePackages(level: number): Package[] {
  return new Array(3)
    .fill(null)
    .map(() => new Package(generateRandomInt(500, END_POS)));
}

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

  pot.draw(context);
}

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomOutOf(max: number): boolean {
  return generateRandomInt(0, max) === 1;
}

export function debounceLog(val: string) {
  if (generateRandomInt(0, 100) === 1) {
    console.log(val);
  }
}

export function vagueFacing(facing: PlayerDirection): VagueFacing {
  if (facing === "rightUp" || facing === "leftUp") return "up";
  if (facing === "rightDown" || facing === "leftDown") return "down";
  return facing;
}
