import { getLevelItem } from "../constructors";
import { DrawObjProps } from "../helpers/types";
import { LevelInfo } from "../level-info/levelInfo";
import { StaticObject } from "../models";

export class PlatformManager {
  platforms: StaticObject[] = [];

  draw(drawProps: DrawObjProps) {
    this.platforms.forEach((p) => p.draw(drawProps));
  }

  reset(level: number, levels: LevelInfo[]) {
    this.platforms = getLevelItem(level, "blocks", levels);
  }
}
