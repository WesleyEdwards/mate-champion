import { getLevelItem } from "../constructors";
import { DrawObjProps } from "../helpers/types";
import { LevelInfo, StaticObject } from "../models";

export class PlatformManager {
  platforms: StaticObject[] = [];

  draw(drawProps: DrawObjProps) {
    this.platforms.forEach((p) => p.draw(drawProps));
  }

  reset(info: LevelInfo) {
    this.platforms = getLevelItem("blocks", info);
  }
}
