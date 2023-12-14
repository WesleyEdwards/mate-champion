import { PackageProps } from "../Bullet/Package";
import { GrogProps } from "../Opponent/Grog";
import { FloatingType, FloorType } from "../Platform/Platform";
import { levelOneInfo } from "./1-levelInfo";
import { levelTwoInfo } from "./2-levelInfo";
import { levelThreeInfo } from "./3-levelInfo";
import { levelFourInfo } from "./4-levelInfo";
import { levelFiveInfo } from "./5-levelInfo";

export type LevelInfo = {
  packages: PackageProps[];
  opponents: { grog: GrogProps[] };
  platforms: FloatingType[];
  floors: FloorType[];
};

const levelsInfo: LevelInfo[] = [
  levelThreeInfo,
  levelFourInfo,
  levelTwoInfo,
  levelOneInfo,
  levelFiveInfo,
];

export const getLevelInfo = (level: number) =>
  levelsInfo[(level % levelsInfo.length) - 1];



// readLevelInfo
