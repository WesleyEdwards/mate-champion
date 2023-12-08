import { createBlocks } from "../constructors";
import { calcPlatColl } from "../GameState/GameStateFunctions";
import { DrawObjProps } from "../helpers/types";
import { StaticObject } from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";

export class PlatformManager {
  platforms: StaticObject[] = createBlocks(1);

  draw(drawProps: DrawObjProps) {
    this.platforms.forEach((p) => p.draw(drawProps));
  }

  reset(level: number) {
    this.platforms = createBlocks(level);
  }

  calcPersonColl(player: Player, opponents: Opponent[]) {
    this.platforms.forEach((platform) => {
      opponents.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, player);
    });
  }
}
