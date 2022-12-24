import { SetUI } from "../App";
import { initialKeyStatus, emptyStats, INCREMENT_VALUE } from "./constants";
import {
  drawComponents,
  calcPlatColl,
  updateWithPlayer,
  updateLiveStatus,
  checkIfCaught,
} from "./GameStateFunctions";
import { Keys, GameStats } from "./models";
import { Opponent } from "./Opponent";
import { Platform } from "./Platform";
import Player from "./Player";
import { Pot } from "./Pot";
import { createOpponents, createPlatforms } from "./utils";

type winState = "win" | "lose" | "playing";

export class GameState {
  winState: winState;
  player: Player;
  platforms: Platform[];
  opponents: Opponent[];
  keys: Keys;
  pot: Pot;
  private scrollOffset: number;
  private stats: GameStats;
  private setUI: SetUI;

  constructor(setUI: SetUI) {
    this.scrollOffset = 0;
    this.winState = "playing";
    this.keys = initialKeyStatus;
    this.player = new Player();
    this.opponents = createOpponents(1);
    this.platforms = createPlatforms(1);
    this.pot = new Pot();
    this.stats = { ...emptyStats };
    this.setUI = setUI;
  }

  private incrementScrollOffset(num: number) {
    this.scrollOffset -= num;
  }

  private setGameState(state: winState) {
    this.winState = state;
  }

  private reset(all?: boolean) {
    if (all) {
      this.stats = { ...emptyStats };
    }
    this.setGameState("playing");
    this.scrollOffset = 0;
    this.player = new Player();
    this.opponents = createOpponents(this.stats.level);
    this.platforms = createPlatforms(this.stats.level);
    this.pot = new Pot();
    this.drawStats();
  }

  private nextLevel() {
    this.stats.level++;
    this.stats.score += 100;
    this.reset();
    this.drawStats();
  }

  private handleLose() {
    this.setGameState("lose");
  }

  private handleLoseLife() {
    this.stats.lives--;
    this.reset();
    if (this.stats.lives === 0) {
      this.handleLose();
    }
  }
  private killOpponent(opp: Opponent) {
    this.stats.score += 10;
    this.opponents.splice(this.opponents.indexOf(opp), 1);
    this.drawStats();
  }

  enterGame() {
    this.reset(true);
  }

  updateEverything() {
    this.player.update(this.keys, this.getScrollOffset());
    this.opponents.forEach((opponent) => opponent.update());
  }

  drawEverything(context: CanvasRenderingContext2D) {
    drawComponents(
      context,
      this.platforms,
      this.opponents,
      this.player,
      this.pot
    );
  }

  calcInteractions() {
    this.platforms.forEach((platform) => {
      this.opponents.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, this.player);
    });

    updateWithPlayer(this.keys, this.player, this.scrollOffset, this.platforms);
    updateWithPlayer(this.keys, this.player, this.scrollOffset, this.opponents);
    updateWithPlayer(this.keys, this.player, this.scrollOffset, [this.pot]);

    const removeOpp = updateLiveStatus(this.player, this.opponents);
    removeOpp && this.killOpponent(removeOpp);

    if (checkIfCaught(this.player, this.opponents)) {
      this.handleLoseLife();
    }

    if (this.player.position.x > this.pot.position.x) {
      this.nextLevel();
    }

    if (this.keys.right && this.player.velocity.x === 0) {
      this.incrementScrollOffset(-INCREMENT_VALUE);
    }
    if (
      this.keys.left &&
      this.player.velocity.x === 0 &&
      this.scrollOffset > 0
    ) {
      this.incrementScrollOffset(INCREMENT_VALUE);
    }
  }

  drawStats() {
    this.setUI.setLevel(this.stats.level);
    this.setUI.setLives(this.stats.lives);
    this.setUI.setScore(this.stats.score);
  }

  getScrollOffset() {
    return this.scrollOffset;
  }
  getScore() {
    return this.stats.score;
  }
}
