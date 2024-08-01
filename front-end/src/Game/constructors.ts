import { FullLevelInfo, StaticObject } from "./models";
import { Platform } from "./Platform/Platform";
import { Grog } from "./Opponent/Grog";

export const getLevelInfo = (
  level: number,
  info: FullLevelInfo[]
): FullLevelInfo => info[(level - 1) % info.length];
