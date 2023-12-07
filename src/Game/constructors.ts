import { StaticObject } from "./models";
import { Floor } from "./Platform/Floor";
import { Platform } from "./Platform/Platform";
import { getLevelInfo } from "./level-info/levelInfo";

const runThing = () => {
  const platforms = [
    { x: 100, y: 150, width: 70, height: 40, color: "springgreen" },
    { x: 1080, y: 400, width: 310, height: 40, color: "springgreen" },
    { x: 1300, y: 290, width: 290, height: 40, color: "springgreen" },
    { x: 1510, y: 120, width: 250, height: 40, color: "red" },
    { x: 1360, y: 350, width: 440, height: 40, color: "springgreen" },
    { x: 1940, y: 300, width: 420, height: 40, color: "springgreen" },
    { x: 2130, y: 220, width: 350, height: 40, color: "red" },
    { x: 2170, y: 250, width: 430, height: 40, color: "springgreen" },
    { x: 2400, y: 230, width: 400, height: 40, color: "springgreen" },
    { x: 2580, y: 410, width: 270, height: 40, color: "springgreen" },
    { x: 3010, y: 410, width: 240, height: 40, color: "yellow" },
    { x: 3080, y: 150, width: 430, height: 40, color: "springgreen" },
    { x: 3410, y: 220, width: 350, height: 40, color: "blue" },
    { x: 3550, y: 380, width: 460, height: 40, color: "red" },
    { x: 3730, y: 150, width: 250, height: 40, color: "springgreen" },
    { x: 4060, y: 340, width: 450, height: 40, color: "springgreen" },
    { x: 4420, y: 240, width: 450, height: 40, color: "springgreen" },
    { x: 4830, y: 240, width: 318, height: 40, color: "springgreen" },
  ];
  const sorted = platforms.sort((a, b) => a.x - b.x);
  console.log(sorted);
};

export function createBlocks(level: number): StaticObject[] {
  const platforms = createPlatforms(level);
  const floors = createFloor(level);
  runThing();
  return [...platforms, ...floors];
}

function createPlatforms(level: number): Platform[] {
  const { platforms } = getLevelInfo(level);
  return platforms.map((p) => new Platform(p));
}

function createFloor(level: number): Floor[] {
  const { floors } = getLevelInfo(level);
  return floors.map((f) => new Floor(f));
}
