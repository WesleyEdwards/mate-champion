import { initialKeyStatus, INCREMENT_VALUE, packageWorth } from "../constants";
import {
  addEventListeners,
  drawComponents,
  updateWithPlayer,
} from "./GameStateFunctions";
import { Keys, SetUI } from "../models";
import { ObjectManager } from "./ObjectManager";
import { GameStatsManager } from "./GameStatsManager";

type winState = "win" | "lose" | "playing";

export class GameState {
  private winState: winState = "playing";
  private objectManager: ObjectManager = new ObjectManager();
  private keys: Keys = initialKeyStatus;

  stats: GameStatsManager = new GameStatsManager();
  private setUI: SetUI;

  constructor(setUI: SetUI) {
    this.setUI = setUI;
    addEventListeners(this.keys);
    this.enterGame();
    this.setGameState("playing");
    this.drawStats();
  }

  reset() {
    this.stats.resetLevel();
    this.objectManager.reset(this.stats.level);
    this.drawStats();
  }

  private nextLevel() {
    this.stats.nextLevel();
    this.reset();
  }

  private handleLose() {
    this.setGameState("lose");
  }

  private handleLoseLife() {
    this.stats.addLives(-1);
    this.reset();
    if (this.stats.lives === 0) {
      this.handleLose();
    }
  }

  private drawStats() {
    this.setUI.setLevel(this.stats.level);
    this.setUI.setScore(this.stats.score);
    this.setUI.setAmmo(this.stats.ammo);
    if (this.stats.lives === 0) {
      this.setUI.setLives(undefined);
    } else {
      this.setUI.setLives(this.stats.lives);
    }
  }

  enterGame() {
    this.setUI.setShowInstructions(false);
  }

  updateEverything() {
    this.objectManager.updateAll(this.keys, this.stats.elapsedTime);

    if (this.objectManager.isCaught()) {
      this.handleLoseLife();
    }

    if (this.keys.right && !this.objectManager.playerXMoving) {
      this.stats.incrementScrollOffset(-INCREMENT_VALUE);
    }

    if (
      this.keys.left &&
      !this.objectManager.playerXMoving &&
      this.stats.scrollOffset > 0
    ) {
      this.stats.incrementScrollOffset(INCREMENT_VALUE);
    }

    this.objectManager.calcInteractions();

    const killedOpp = this.objectManager.getKilledOpponents();
    if (killedOpp) this.stats.addScore(10);

    const shot = this.objectManager.calcBullets(this.stats.ammo);
    if (shot) this.stats.addAmmo(-1);

    const nextLevel = this.objectManager.nextLevel;
    if (nextLevel) this.nextLevel();

    const packagesReceived = this.objectManager.getReceivedPackages();
    if (packagesReceived) {
      this.stats.addAmmo(packagesReceived * packageWorth);
    }

    if (nextLevel || killedOpp || shot || packagesReceived) {
      this.drawStats();
    }

    updateWithPlayer(
      this.keys,
      this.objectManager.player,
      this.stats.scrollOffset,
      this.objectManager.objectsToUpdatePos
    );
  }

  drawEverything(context: CanvasRenderingContext2D) {
    drawComponents(context, this.objectManager);
  }

  setGameState(state: winState) {
    this.winState = state;
  }

  getScore() {
    return this.stats.score;
  }

  isLost(): boolean {
    return this.winState === "lose";
  }

  get showNextLevel() {
    return this.stats.timeInLevel < 3000;
  }

  get level(): number {
    return this.stats.level;
  }
}
