import { StaticObject } from "./models";
import { Floor } from "./Platform/Floor";
import { Platform } from "./Platform/Platform";
import { getLevelInfo } from "./level-info/levelInfo";
import { Opponent } from "./Opponent/Opponent";
import { Package } from "./Bullet/Package";

// const runThing = () => {
//   const platforms = [
//     { x: 100, y: 150, width: 80, height: 40, color: "red" },
//     { x: 350, y: 450, width: 230, height: 40, color: "red" },
//     { x: 540, y: 110, width: 220, height: 40, color: "red" },
//     { x: 950, y: 280, width: 260, height: 40, color: "red" },
//     { x: 1000, y: 400, width: 470, height: 40, color: "red" },
//     { x: 1130, y: 210, width: 300, height: 40, color: "red" },
//     { x: 1250, y: 160, width: 360, height: 40, color: "red" },
//     { x: 1680, y: 300, width: 60, height: 40, color: "red" },
//     { x: 1830, y: 430, width: 100, height: 40, color: "red" },
//     { x: 1870, y: 270, width: 60, height: 40, color: "red" },
//     { x: 2020, y: 330, width: 100, height: 40, color: "red" },
//     { x: 2320, y: 400, width: 100, height: 40, color: "red" },
//     { x: 2380, y: 280, width: 450, height: 40, color: "red" },
//     { x: 2730, y: 210, width: 440, height: 40, color: "red" },
//     { x: 2750, y: 150, width: 340, height: 40, color: "red" },
//     { x: 3200, y: 420, width: 200, height: 40, color: "red" },
//     { x: 3290, y: 360, width: 100, height: 40, color: "red" },
//     { x: 3550, y: 270, width: 100, height: 40, color: "red" },
//     { x: 3730, y: 300, width: 100, height: 40, color: "red" },
//     { x: 3920, y: 100, width: 320, height: 40, color: "red" },
//     { x: 3930, y: 180, width: 350, height: 40, color: "red" },
//     { x: 4080, y: 380, width: 340, height: 40, color: "red" },
//     { x: 4240, y: 40, width: 200, height: 40, color: "red" },
//     { x: 4330, y: 450, width: 80, height: 40, color: "red" },
//     { x: 4570, y: 420, width: 310, height: 40, color: "red" },
//   ];
//   const sorted = platforms.sort((a, b) => a.x - b.x);
//   console.log(sorted);
// };
// runThing()


export function createBlocks(level: number): StaticObject[] {
  const platforms = createPlatforms(level);
  const floors = createFloor(level);
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

export function createOpponents(level: number): Opponent[] {
  const { opponents } = getLevelInfo(level);
  return opponents.map((o) => new Opponent(o));
}

export function createMatePackages(level: number): Package[] {
  const { packages } = getLevelInfo(level);
  return packages.map((p) => new Package(p));
}