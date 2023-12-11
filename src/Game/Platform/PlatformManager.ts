import { createBlocks } from "../constructors";
import { calcPlatColl } from "../GameState/GameStateFunctions";
import { DrawObjProps } from "../helpers/types";
import { StaticObject } from "../models";
import { Opponents } from "../Opponent/OpponentManager";
import Player from "../Player/Player";

export class PlatformManager {
  platforms: StaticObject[] = createBlocks(1);

  draw(drawProps: DrawObjProps) {
    this.platforms.forEach((p) => p.draw(drawProps));
  }

  reset(level: number) {
    this.platforms = createBlocks(level);
  }

  calcPersonColl(player: Player, opponents: Opponents) {
    this.platforms.forEach((platform) => {
      opponents.grog.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, player);
    });
  }
}
