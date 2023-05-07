import { createBlocks } from "../constructors";
import { calcPlatColl } from "../GameState/GameStateFunctions";
import { StaticObject } from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";

export class PlatformManager {
  platforms: StaticObject[] = createBlocks(1);
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  draw() {
    this.platforms.forEach((p) => p.draw(this.context));
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
