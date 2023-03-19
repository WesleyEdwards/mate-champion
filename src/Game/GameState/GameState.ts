import {
  initialKeyStatus,
  INCREMENT_VALUE,
  packageWorth,
  winState,
  DISPLAY_LEVEL_TIME,
} from "../constants";
import { addEventListeners, updateWithPlayer } from "./GameStateFunctions";
import { Keys, SetUI } from "../models";
import { ObjectManager } from "./ObjectManager";
import { GameStatsManager } from "./GameStatsManager";
import { drawBackground, drawLava } from "../Drawing/drawer";
import { displayNextLevel } from "../Drawing/uiHelpers";
import { debounceLog } from "../utils";

export class GameState {
  private winState: winState = "initial";
  private objectManager: ObjectManager;
  private keys: Keys = initialKeyStatus;
  private setUI: SetUI;
  private stats: GameStatsManager = new GameStatsManager();

  constructor(setUI: SetUI, context: CanvasRenderingContext2D) {
    this.objectManager = new ObjectManager(context);
    this.setUI = setUI;

    this.drawStats();
    addEventListeners(this.keys);
    setUI.setShowInstructions(false);
  }

  reset() {
    this.stats.resetLevel();
    this.winState = "nextLevel";
    this.objectManager.reset(this.stats.level);
    this.drawStats();
  }

  private handleLoseLife() {
    this.stats.addLives(-1);
    this.reset();
    if (this.stats.lives === 0) {
      this.winState = "lose";
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

  update() {
    if (!this.isWinState("playing")) return;
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
      this.stats.scrollOffset,
      this.objectManager.player,
      this.objectManager.objectsToUpdatePos
    );
  }

  drawEverything(context: CanvasRenderingContext2D) {
    if (this.showNextLevel) {
      displayNextLevel(context, this.level);
      return;
    }

    drawBackground(context);
    drawLava(context);
    this.objectManager.drawObjects(context);
  }

  private nextLevel() {
    this.winState = "nextLevel";
    this.stats.nextLevel();
    this.reset();
  }

  isWinState(state: winState): boolean {
    return this.winState === state;
  }

  get showNextLevel() {
    const showNext = this.stats.timeInLevel < DISPLAY_LEVEL_TIME;
    if (!showNext) this.winState = "playing";
    return showNext;
  }

  get level(): number {
    return this.stats.level;
  }

  updateTime(timeStamp: number) {
    this.stats.updateTime(timeStamp);
  }
}
