import { StaticObject } from "./models";
import { Platform } from "./Platform/Platform";
import { LevelInfo, levelsInfo } from "./level-info/levelInfo";
import { Package } from "./Bullet/Package";
import { Grog } from "./Opponent/Grog";
import { Opponents } from "./Opponent/OpponentManager";

type ReturnItem<T extends "blocks" | "opponents" | "package"> =
  T extends "blocks"
    ? Platform[]
    : T extends "opponents"
    ? Opponents
    : Package[];

const getLevelInfo = (level: number, info: LevelInfo[]) =>
  levelsInfo[(level - 1) % info.length];

export function getLevelItem<T extends "blocks" | "opponents" | "package">(
  level: number,
  item: T,
  info: LevelInfo[]
): ReturnItem<T> {
  return {
    blocks: () => {
      const { platforms, floors } = getLevelInfo(level, info);
      return [...platforms, ...floors].map((p) => new Platform(p));
    },
    opponents: () => {
      const { opponents } = getLevelInfo(level, info);
      return { grog: opponents.grog.map((o) => new Grog(o)) };
    },
    package: () => {
      const { packages } = getLevelInfo(level, info);
      return packages.map((p) => new Package(p));
    },
  }[item]() as ReturnItem<T>;
}
