import { DISPLAY_LEVEL_TIME } from "../constants";
import { Keys, SetUI } from "../models";
import { ObjectManager } from "./ObjectManager";
import { GameStatsManager } from "./GameStatsManager";
import { GameDrawer } from "./GameDrawer";
import { Canvas, WinState } from "../helpers/types";
import { addEventListeners } from "../helpers/eventListeners";
import { devSettings } from "../devSettings";
import { DevContentCreate } from "../dev/DevContentCreate";

export class GameState {
  private winState: WinState = "initial";
  private objectManager: ObjectManager;
  private keys: Keys;
  private setUI: SetUI;
  private gameDrawer: GameDrawer;
  private stats: GameStatsManager = new GameStatsManager();
  private cxt: Canvas;
  private devContentCreate: DevContentCreate | null;

  constructor(
    setUI: SetUI,
    canvas: HTMLCanvasElement,
    cxt: CanvasRenderingContext2D
  ) {
    this.keys = addEventListeners();
    this.objectManager = new ObjectManager();
    this.setUI = setUI;
    this.gameDrawer = new GameDrawer();
    this.cxt = cxt;
    this.devContentCreate = devSettings.logClickPos
      ? new DevContentCreate({
          canvas,
          objectManager: this.objectManager,
        })
      : null;

    this.drawStats();
  }

  update(timeStamp: number) {
    this.stats.updateTime(timeStamp);
    if (!this.isWinState("playing")) return;
    const { statsInfo, levelInfo } = this.objectManager.updateAll(
      this.keys,
      this.stats.elapsedTime,
      this.stats.ammo,
      this.objectManager.player.whereToDrawOffset
    );

    const statsRes = this.stats.update(statsInfo);

    if (levelInfo.isCaught) this.handleLoseLife();
    if (levelInfo.nextLevel) this.nextLevel();

    if (levelInfo.nextLevel || statsRes) this.drawStats();

    this.devContentCreate?.update(this.objectManager.player.whereToDraw);
  }

  render() {
    this.gameDrawer.drawBackground(
      this.cxt,
      this.showMessage,
      this.winState,
      this.stats.level,
      this.objectManager.player.whereToDraw
    );
    if (!this.showMessage) {
      this.objectManager.drawObjects(
        this.cxt,
        this.objectManager.player.whereToDraw
      );
    }
    if (devSettings.showDevStats) {
      this.gameDrawer.showDevStats(
        this.cxt,
        this.objectManager.player.vector.position,
        this.objectManager.player.vector.velocity,
        this.stats.fps
      );
    }
  }

  isWinState(state: WinState): boolean {
    return this.winState === state;
  }

  private resetLevel() {
    this.stats.resetLevel();
    this.objectManager.reset(this.stats.level);
    this.drawStats();
  }

  private handleLoseLife() {
    if (devSettings.noDie) return;
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
