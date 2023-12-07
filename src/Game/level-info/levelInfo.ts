import { PackageProps } from "../Bullet/Package";
import { OppProps } from "../Opponent/Opponent";
import { PlatProps } from "../Platform/Platform";
import { levelOneInfo } from "./1-levelInfo";
import { levelTwoInfo } from "./2-levelInfo";
import { levelThreeInfo } from "./3-levelInfo";
import { levelFourInfo } from "./4-levelInfo";
import { levelFiveInfo } from "./5-levelInfo";

export type LevelInfo = {
  packages: PackageProps[];
  opponents: OppProps[];
  platforms: PlatProps[];
  floors: PlatProps[];
};

const levelsInfo: LevelInfo[] = [
  levelTwoInfo,
  levelOneInfo,
  levelThreeInfo,
  levelFourInfo,
  levelFiveInfo,
];

export const getLevelInfo = (level: number) =>
  levelsInfo[(level % levelsInfo.length) - 1];
