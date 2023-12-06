import { PlatProps } from "../Platform/Platform";
import { levelOneInfo } from "./1-levelInfo";
import { levelTwoInfo } from "./2-levelInfo";

export type LevelInfo = {
  platformColor: string;
  floorColor: string;
  platforms: Omit<PlatProps, "color">[];
  floors: Omit<PlatProps, "color">[];
};

const levelsInfo: LevelInfo[] = [levelOneInfo, levelTwoInfo];

export const getLevelInfo = (level: number) =>
  levelsInfo[level % levelsInfo.length];
