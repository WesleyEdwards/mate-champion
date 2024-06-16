import { getLevelItem } from "../constructors";
import { DrawObjProps } from "../helpers/types";
import { FullLevelInfo, StaticObject } from "../models";

export class PlatformManager {
  platforms: StaticObject[] = [];

  draw(drawProps: DrawObjProps) {
    this.platforms.forEach((p) => p.draw(drawProps));
  }

  reset(info: FullLevelInfo) {
    this.platforms = getLevelItem("blocks", info);
  }
}
