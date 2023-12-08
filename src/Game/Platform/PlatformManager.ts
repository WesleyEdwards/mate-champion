import { createBlocks } from "../constructors";
import { calcPlatColl } from "../GameState/GameStateFunctions";
import { Canvas } from "../helpers/types";
import { debounceLog } from "../helpers/utils";
import { StaticObject } from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";

export class PlatformManager {
  platforms: StaticObject[] = createBlocks(1);

  draw(cxt: Canvas) {
    this.platforms.forEach((p) => p.draw(cxt));
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
