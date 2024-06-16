import { areTouching } from "../GameState/GameStateFunctions";
import { playerConst } from "../constants";
import { getLevelItem } from "../constructors";
import { DrawObjProps } from "../helpers/types";
import { Coordinates, FullLevelInfo } from "../models";
import { Grog } from "./Grog";

export type Opponents = { grog: Grog[] };
export class OpponentManager {
  opponents: Opponents = { grog: [] };

  update(elapsedTime: number) {
    this.opponents.grog.forEach((o) => {
      if (o.dyingState === "dead") {
        this.opponents.grog.splice(this.opponents.grog.indexOf(o), 1);
      }

      o.update(elapsedTime);
    });
  }

  draw(drawProps: DrawObjProps) {
    this.opponents.grog.forEach((o) => o.draw(drawProps));
  }

  touchingPlayer(playerPos: Coordinates) {
    return this.opponents.grog.some(
      (opp) =>
        opp.dyingState === "alive" &&
        areTouching(playerPos, opp.vector.position, playerConst.radius * 2)
    );
  }

  markAsDying(indexes: { grog: number[] }) {
    indexes.grog.forEach((opp) => {
      this.opponents.grog[opp].markAsDying();
    });
  }

  reset(info: FullLevelInfo) {
    this.opponents = getLevelItem("opponents", info);
  }
}
