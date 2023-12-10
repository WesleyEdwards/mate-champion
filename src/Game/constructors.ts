import { StaticObject } from "./models";
import { Platform } from "./Platform/Platform";
import { getLevelInfo } from "./level-info/levelInfo";
import { Opponent } from "./Opponent/Opponent";
import { Package } from "./Bullet/Package";

export function createBlocks(level: number): Platform[] {
  const { platforms, floors } = getLevelInfo(level);
  return [...platforms, ...floors].map((p) => new Platform(p));
}

export function createOpponents(level: number): Opponent[] {
  const { opponents } = getLevelInfo(level);
  return opponents.map((o) => new Opponent(o));
}

export function createMatePackages(level: number): Package[] {
  const { packages } = getLevelInfo(level);
  return packages.map((p) => new Package(p));
}
