import { Package } from "./Bullet/Package";
import { listOfColors, NUM_PLATFORMS, END_POS } from "./constants";
import { StaticObject } from "./models";
import { Floor } from "./Platform/Floor";
import { Platform } from "./Platform/Platform";
import { generateRandomInt } from "./utils";

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
