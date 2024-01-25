import { PackageProps } from "../Bullet/Package";
import { GrogProps } from "../Opponent/Grog";
import { FloatingType, FloorType } from "../Platform/Platform";
import { levelInto } from "./levelntro";
import { levelTwoInfo } from "./2-levelInfo";
import { levelThreeInfo } from "./3-levelInfo";
import { levelAbandonHope } from "./levelAbandonHope";
import { levelFiveInfo } from "./5-levelInfo";
import { sandboxLevel } from "./sandbox/sandboxLevel";
import { ammoUp } from "./ammoUp";

export type LevelInfo = {
  packages: PackageProps[];
  opponents: { grog: GrogProps[] };
  platforms: FloatingType[];
  floors: FloorType[];
};

/**
 * levelIntro
 * levelTwoInfo
 * levelThreeinfo
 * levelFiveInfo
 * ammoUp
 * levelAbandonHope
 */

const levelsInfo: LevelInfo[] = [
  // sandboxLevel,
  levelInto,
  levelTwoInfo,
  levelThreeInfo,
  levelFiveInfo,
  ammoUp,
  levelAbandonHope,
];

export const getLevelInfo = (level: number) =>
  levelsInfo[(level - 1) % levelsInfo.length];
