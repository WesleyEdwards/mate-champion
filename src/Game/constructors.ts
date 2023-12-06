import { END_POS } from "./constants";
import { StaticObject } from "./models";
import { Floor } from "./Platform/Floor";
import { Platform } from "./Platform/Platform";
import { levelOneInfo } from "./level-info/1-levelInfo";
import { generateRandomInt } from "./utils";
import { getLevelInfo } from "./level-info/levelInfo";

export function createBlocks(level: number): StaticObject[] {
  const blocks = createPlatforms(level);
  blocks.push(...createFloor(level));
  return blocks;
}

function createPlatforms(level: number): Platform[] {
  console.log(getLevelInfo(level));
  const { platforms, platformColor } = getLevelInfo(level);
  return platforms.map((p) => new Platform({ ...p, color: platformColor }));
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
