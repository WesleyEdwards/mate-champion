import { Bullet } from "./Bullet";
import { initialKeyStatus, emptyStats, INCREMENT_VALUE } from "./constants";
import {
  drawComponents,
  calcPlatColl,
  updateWithPlayer,
  updateLiveStatus,
  checkIfCaught,
} from "./GameStateFunctions";
import { Keys, GameStats, SetUI } from "./models";
import { Opponent } from "./Opponent/Opponent";
import { Platform } from "./Platform";
import Player from "./Player/Player";
import { Pot } from "./Pot";
import { createOpponents, createPlatforms } from "./utils";

type winState = "win" | "lose" | "playing";

export interface GameObjects {
  player: Player;
  platforms: Platform[];
  opponents: Opponent[];
  pot: Pot;
  bullets: Bullet[];
}

export class GameState {
  winState: winState;
  objects: GameObjects;
  keys: Keys;
  private scrollOffset: number;
  private stats: GameStats;
  private setUI: SetUI;

  constructor(setUI: SetUI) {
    this.scrollOffset = 0;
    this.winState = "playing";
    this.keys = initialKeyStatus;
    this.objects = {
      player: new Player(),
      platforms: createPlatforms(1),
      opponents: createOpponents(1),
      pot: new Pot(),
      bullets: [],
    };
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
    this.objects.player = new Player();
    this.objects.opponents = createOpponents(this.stats.level);
    this.objects.platforms = createPlatforms(this.stats.level);
    this.objects.pot = new Pot();
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
    this.objects.opponents.splice(this.objects.opponents.indexOf(opp), 1);
    this.drawStats();
  }

  enterGame() {
    this.setUI.setShowInstructions(false);
    this.reset(true);
  }

  updateEverything() {
    this.objects.player.update(this.keys);
    this.objects.opponents.forEach((opponent) => opponent.update());
  }

  drawEverything(context: CanvasRenderingContext2D) {
    drawComponents(
      context,
      this.objects.platforms,
      this.objects.opponents,
      this.objects.player,
      this.objects.pot
    );
  }

  calcInteractions() {
    this.objects.platforms.forEach((platform) => {
      this.objects.opponents.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, this.objects.player);
    });

    updateWithPlayer(
      this.keys,
      this.objects.player,
      this.scrollOffset,
      this.objects.platforms
    );
    updateWithPlayer(
      this.keys,
      this.objects.player,
      this.scrollOffset,
      this.objects.opponents
    );
    updateWithPlayer(this.keys, this.objects.player, this.scrollOffset, [
      this.objects.pot,
    ]);

    const removeOpp = updateLiveStatus(
      this.objects.player,
      this.objects.opponents
    );
    removeOpp && this.killOpponent(removeOpp);

    if (checkIfCaught(this.objects.player, this.objects.opponents)) {
      this.handleLoseLife();
    }

    if (this.objects.player.position.x > this.objects.pot.position.x) {
      this.nextLevel();
    }

    if (this.keys.right && this.objects.player.velocity.x === 0) {
      this.incrementScrollOffset(-INCREMENT_VALUE);
    }
    if (
      this.keys.left &&
      this.objects.player.velocity.x === 0 &&
      this.scrollOffset > 0
    ) {
      this.incrementScrollOffset(INCREMENT_VALUE);
    }
  }

  drawStats() {
    this.setUI.setLevel(this.stats.level);
    this.setUI.setScore(this.stats.score);
    this.setUI.setAmmo(this.stats.ammo);
    if (this.stats.lives === 0) {
      this.setUI.setLives(undefined);
    } else {
      this.setUI.setLives(this.stats.lives);
    }
  }

  getScrollOffset() {
    return this.scrollOffset;
  }
  getScore() {
    return this.stats.score;
  }
}
