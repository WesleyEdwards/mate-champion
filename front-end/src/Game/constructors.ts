import { LevelInfo, StaticObject } from "./models";
import { Platform } from "./Platform/Platform";
import { Package } from "./Bullet/Package";
import { Grog } from "./Opponent/Grog";
import { Opponents } from "./Opponent/OpponentManager";

type ReturnItem<T extends "blocks" | "opponents" | "package"> =
  T extends "blocks"
    ? Platform[]
    : T extends "opponents"
    ? Opponents
    : Package[];

export const getLevelInfo = (level: number, info: LevelInfo[]): LevelInfo =>
  info[(level - 1) % info.length];

export function getLevelItem<T extends "blocks" | "opponents" | "package">(
  item: T,
  info: LevelInfo
): ReturnItem<T> {
  return {
    blocks: () => {
      const { platforms, floors } = info;
      return [...platforms, ...floors].map((p) => new Platform(p));
    },
    opponents: () => {
      const { opponents } = info;
      return { grog: opponents.grog.map((o) => new Grog(o)) };
    },
    package: () => {
      const { packages } = info;
      return packages.map((p) => new Package(p));
    },
  }[item]() as ReturnItem<T>;
}
