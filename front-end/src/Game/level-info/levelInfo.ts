import { PackageProps } from "../Bullet/Package";
import { GrogProps } from "../Opponent/Grog";
import { FloatingType, FloorType } from "../Platform/Platform";
import { levelInto } from "./levelntro";
import { levelTwoInfo } from "./2-levelInfo";
import { levelThreeInfo } from "./3-levelInfo";
import { levelAbandonHope } from "./levelAbandonHope";
import { levelFiveInfo } from "./5-levelInfo";

export type LevelInfo = {
  packages: PackageProps[];
  opponents: { grog: GrogProps[] };
  platforms: FloatingType[];
  floors: FloorType[];
};

const levelsInfo: LevelInfo[] = [
  levelFiveInfo,
  levelInto,
  levelTwoInfo,
  levelThreeInfo,
  levelAbandonHope,
];

export const getLevelInfo = (level: number) =>
  levelsInfo[(level % levelsInfo.length) - 1];

// readLevelInfo
