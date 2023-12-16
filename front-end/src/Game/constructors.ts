import { StaticObject } from "./models";
import { Platform } from "./Platform/Platform";
import { getLevelInfo } from "./level-info/levelInfo";
import { Package } from "./Bullet/Package";
import { Grog } from "./Opponent/Grog";
import { Opponents } from "./Opponent/OpponentManager";

export function createBlocks(level: number): Platform[] {
  const { platforms, floors } = getLevelInfo(level);
  return [...platforms, ...floors].map((p) => new Platform(p));
}

export function createOpponents(level: number): Opponents {
  const { opponents } = getLevelInfo(level);
  return { grog: opponents.grog.map((o) => new Grog(o)) };
}

export function createMatePackages(level: number): Package[] {
  const { packages } = getLevelInfo(level);
  return packages.map((p) => new Package(p));
}
