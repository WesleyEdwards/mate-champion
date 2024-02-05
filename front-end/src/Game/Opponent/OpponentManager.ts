import { areTouching } from "../GameState/GameStateFunctions";
import { playerConst } from "../constants";
import { getLevelItem } from "../constructors";
import { Canvas, DrawObjProps } from "../helpers/types";
import { LevelInfo, levelsInfo } from "../level-info/levelInfo";
import { Coordinates } from "../models";
import { Grog } from "./Grog";

export type Opponents = { grog: Grog[] };
export class OpponentManager {
  opponents: Opponents = { grog: [] };

  update(elapsedTime: number) {
    this.opponents.grog.forEach((o) => o.update(elapsedTime));
  }

  draw(drawProps: DrawObjProps) {
    this.opponents.grog.forEach((o) => o.draw(drawProps));
  }

  touchingPlayer(playerPos: Coordinates) {
    return this.opponents.grog.some((opp) =>
      areTouching(playerPos, opp.vector.position, playerConst.radius * 2)
    );
  }

  removeOpponents(indexes: { grog: number[] }) {
    indexes.grog.forEach((opp) => {
      this.opponents.grog.splice(opp, 1);
    });
  }

  reset(level: number, levels: LevelInfo[]) {
    this.opponents = getLevelItem(level, "opponents", levels);
  }
}
