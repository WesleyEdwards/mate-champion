import { PackageProps } from "../Bullet/Package";
import { GrogProps } from "../Opponent/Grog";
import { FloatingType, FloorType } from "../Platform/Platform";
import { levelInto } from "./levelntro";
import { levelTwoInfo } from "./2-levelInfo";
import { levelThreeInfo } from "./3-levelInfo";
import { levelAbandonHope } from "./levelAbandonHope";
import { levelFiveInfo } from "./5-levelInfo";
import { sandboxLevel } from "./sandboxLevel";
import { prettyHard } from "./pretty-hard";

export type LevelInfo = {
  packages: PackageProps[];
  opponents: { grog: GrogProps[] };
  platforms: FloatingType[];
  floors: FloorType[];
};

const levelsInfo: LevelInfo[] = [
  sandboxLevel,
  prettyHard,
  levelThreeInfo,
  levelInto,
  levelFiveInfo,
  levelAbandonHope,
  levelTwoInfo,
];

export const getLevelInfo = (level: number) =>
  levelsInfo[(level % levelsInfo.length) - 1];
