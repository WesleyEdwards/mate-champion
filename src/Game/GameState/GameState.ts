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
  private scrollOffset: number = 0;
  stats: GameStatsManager = new GameStatsManager();
  private setUI: SetUI;

  constructor(setUI: SetUI) {
    this.setUI = setUI;
    addEventListeners(this.keys);
  }

  setGameState(state: winState) {
    this.winState = state;
  }

  reset(all?: boolean) {
    if (all) {
      this.stats.resetAll();
    }
    this.scrollOffset = 0;
    this.objectManager.reset(this.stats.level);
    this.drawStats();
  }

  private nextLevel() {
    this.stats.level++;
    this.stats.ammo += 20;
    this.stats.score += 100;
    this.reset();
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

  private incrementScrollOffset(num: number) {
    this.scrollOffset -= num;
  }
  enterGame() {
    this.setUI.setShowInstructions(false);
  }

  updateEverything(elapsedTime: number) {
    this.objectManager.updateAll(this.keys);
  }

  drawEverything(context: CanvasRenderingContext2D) {
    drawComponents(context, this.objectManager);
  }

  calcInteractions(setNewLevel: () => void) {
    if (this.objectManager.isCaught()) {
      this.handleLoseLife();
    }

    if (this.keys.right && !this.objectManager.playerXMoving) {
      this.incrementScrollOffset(-INCREMENT_VALUE);
    }

    if (
      this.keys.left &&
      !this.objectManager.playerXMoving &&
      this.scrollOffset > 0
    ) {
      this.incrementScrollOffset(INCREMENT_VALUE);
    }

    this.objectManager.calcInteractions();

    const killedOpp = this.objectManager.getKilledOpponents();
    if (killedOpp) this.stats.score += 10;

    const shot = this.objectManager.calcBullets(this.stats.ammo);
    if (shot) this.stats.ammo--;

    const nextLevel = this.objectManager.nextLevel;
    if (nextLevel) {
      setNewLevel();
      this.nextLevel();
    }

    const packagesReceived = this.objectManager.getReceivedPackages();
    if (packagesReceived) {
      this.stats.ammo += packagesReceived * packageWorth;
    }

    if (nextLevel || killedOpp || shot || packagesReceived) {
      this.drawStats();
    }

    updateWithPlayer(
      this.keys,
      this.objectManager.player,
      this.scrollOffset,
      this.objectManager.objectsToUpdatePos
    );
  }

  getScrollOffset() {
    return this.scrollOffset;
  }
  getScore() {
    return this.stats.score;
  }
  getLevel() {
    return this.stats.level;
  }

  isLost(): boolean {
    return this.winState === "lose";
  }
}
