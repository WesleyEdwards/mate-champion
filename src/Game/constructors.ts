import { StaticObject } from "./models";
import { Floor } from "./Platform/Floor";
import { Platform } from "./Platform/Platform";
import { getLevelInfo } from "./level-info/levelInfo";
import { Opponent } from "./Opponent/Opponent";
import { Package } from "./Bullet/Package";

// const runThing = () => {
//   const platforms = [
//     { x: 6500, y: 530, width: 900, height: 60, color: "green" },
//     { x: 5500, y: 530, width: 900, height: 60, color: "green" },
//     { x: 4500, y: 530, width: 810, height: 60, color: "green" },
//     { x: 3500, y: 530, width: 730, height: 60, color: "green" },
//     { x: 2500, y: 530, width: 890, height: 60, color: "green" },
//     { x: 1500, y: 530, width: 690, height: 60, color: "green" },
//     { x: 500, y: 530, width: 900, height: 60, color: "green" },
//     { x: -500, y: 530, width: 780, height: 60, color: "green" },
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