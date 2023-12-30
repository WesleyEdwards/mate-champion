import { createBlocks } from "../constructors";
import { DrawObjProps } from "../helpers/types";
import { StaticObject } from "../models";

export class PlatformManager {
  platforms: StaticObject[] = createBlocks(1);

  draw(drawProps: DrawObjProps) {
    this.platforms.forEach((p) => p.draw(drawProps));
  }

  reset(level: number) {
    this.platforms = createBlocks(level);
  }
}
