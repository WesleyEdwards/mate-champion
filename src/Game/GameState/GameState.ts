import { initialKeyStatus, winState, DISPLAY_LEVEL_TIME } from "../constants";
import { addEventListeners, updateWithPlayer } from "./GameStateFunctions";
import { Keys, SetUI } from "../models";
import { ObjectManager } from "./ObjectManager";
import { GameStatsManager } from "./GameStatsManager";
import { displayNextLevel } from "../Drawing/uiHelpers";
import { GameDrawer } from "./GameDrawer";
import { debounceLog } from "../utils";

export class GameState {
  private winState: winState = "initial";
  private objectManager: ObjectManager;
  private keys: Keys = initialKeyStatus;
  private setUI: SetUI;
  private gameDrawer: GameDrawer;
  private stats: GameStatsManager = new GameStatsManager();

  constructor(setUI: SetUI, context: CanvasRenderingContext2D) {
    this.objectManager = new ObjectManager(context);
    this.setUI = setUI;
    this.gameDrawer = new GameDrawer(context);

    this.drawStats();
    addEventListeners(this.keys);
  }

  update(timeStamp: number) {
    this.stats.updateTime(timeStamp);
    if (!this.isWinState("playing")) return;

    const { statsInfo, levelInfo } = this.objectManager.updateAll(
      this.keys,
      this.stats.elapsedTime,
      this.stats.ammo
    );

    const statsRes = this.stats.update(statsInfo);

    if (levelInfo.isCaught) this.handleLoseLife();
    if (levelInfo.nextLevel) this.nextLevel();

    if (levelInfo.nextLevel || statsRes) this.drawStats();

    updateWithPlayer(
      this.keys,
      this.stats.scrollOffset,
      this.objectManager.player,
      this.objectManager.objectsToUpdatePos
    );
  }

  render() {
    this.gameDrawer.drawBackground(
      this.showMessage,
      this.winState,
      this.stats.level,
      this.stats.scrollOffset
    );
    if (!this.showMessage) {
      this.objectManager.drawObjects();
    }
  }

  isWinState(state: winState): boolean {
    return this.winState === state;
  }

  private resetLevel() {
    this.stats.resetLevel();
    this.objectManager.reset(this.stats.level);
    this.drawStats();
  }

  private handleLoseLife() {
    this.winState = "loseLife";
    this.stats.addLives(-1);
    this.resetLevel();
    if (this.stats.lives === 0) {
      this.winState = "lose";
    }
  }

  private drawStats() {
    this.setUI.modifyStats({
      level: this.stats.level,
      score: this.stats.score,
      ammo: this.stats.ammo,
      lives: this.stats.lives,
    });
  }

  private nextLevel() {
    this.winState = "nextLevel";
    this.stats.nextLevel();
    this.resetLevel();
  }

  private get showMessage() {
    const showMessage = this.stats.timeInLevel < DISPLAY_LEVEL_TIME;
    if (!showMessage) this.winState = "playing";
    return showMessage;
  }
}
