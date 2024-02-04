import { DISPLAY_LEVEL_TIME } from "../constants";
import { Keys, SetUI } from "../models";
import { ObjectManager } from "./ObjectManager";
import { GameStatsManager } from "./GameStatsManager";
import { GameDrawer } from "./GameDrawer";
import { Canvas, WinState } from "../helpers/types";
import { addEventListeners } from "../helpers/eventListeners";
import { devSettings } from "../devSettings";
import { DevContentCreate } from "../devTools/DevContentCreate";
import { CameraDisplay } from "./CameraDisplay";
import { debounceLog } from "../helpers/utils";

export class GameState {
  currStateOfGame: WinState = "initial";
  private objectManager: ObjectManager;
  private keys: Keys;
  private setUI: SetUI;
  private gameDrawer: GameDrawer;
  private stats: GameStatsManager = new GameStatsManager();
  private cxt: Canvas;
  private devContentCreate: DevContentCreate | null;
  private cameraDisplay: CameraDisplay = new CameraDisplay();

  constructor(
    setUI: SetUI,
    canvas: HTMLCanvasElement,
    cxt: CanvasRenderingContext2D
  ) {
    this.keys = addEventListeners(() => {
      const newState = this.currStateOfGame === "pause" ? "playing" : "pause";
      setUI.handlePause(newState === "pause");
      this.currStateOfGame = newState;
    });
    this.objectManager = new ObjectManager();
    this.setUI = setUI;
    this.gameDrawer = new GameDrawer();
    this.cxt = cxt;
    this.devContentCreate = devSettings.courseBuilder
      ? new DevContentCreate({
          canvas,
          objectManager: this.objectManager,
        })
      : null;

    this.drawStats();
  }

  update(timeStamp: number) {
    this.stats.updateTime(timeStamp);
    if (this.currStateOfGame !== "playing") {
      return;
    }
    this.cameraDisplay.update(
      this.stats.elapsedTime,
      this.objectManager.player.vector
    );
    const { statsInfo, levelInfo } = this.objectManager.updateAll(
      this.keys,
      this.stats.elapsedTime,
      this.stats.ammo
    );

    const statsRes = this.stats.update(statsInfo);

    if (levelInfo.isCaught) this.handleLoseLife();
    if (levelInfo.nextLevel) this.nextLevel();

    if (levelInfo.nextLevel || statsRes) this.drawStats();

    this.devContentCreate?.update(this.cameraDisplay.cameraOffset);
  }

  render() {
    this.gameDrawer.drawBackground(
      this.cxt,
      this.showMessage,
      this.currStateOfGame,
      this.stats.level,
      this.cameraDisplay.cameraOffset
    );
    if (!this.showMessage) {
      this.objectManager.drawObjects(this.cxt, this.cameraDisplay.cameraOffset);
    }
    if (devSettings.showDevStats) {
      this.gameDrawer.showDevStats(
        this.cxt,
        this.objectManager.player.vector.position,
        this.objectManager.player.vector.velocity,
        this.stats.fps
      );
    }
    this.cameraDisplay.draw(this.cxt);
  }

  private resetLevel() {
    this.stats.resetLevel();
    this.objectManager.reset(this.stats.level);
    this.cameraDisplay.reset();
    this.drawStats();
  }

  private handleLoseLife() {
    if (devSettings.noDie) return;
    this.currStateOfGame = "loseLife";
    this.stats.addLives(-1);
    this.resetLevel();
    if (this.stats.lives === 0) {
      this.currStateOfGame = "lose";
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
    this.currStateOfGame = "nextLevel";
    this.stats.nextLevel();
    this.resetLevel();
  }

  private get showMessage() {
    const showMessage = this.stats.timeInLevel < DISPLAY_LEVEL_TIME;
    if (
      !showMessage &&
      ["initial", "loseLife", "nextLevel"].includes(this.currStateOfGame)
    ) {
      this.currStateOfGame = "playing";
    }
    return showMessage;
  }

  get score() {
    return this.stats.score;
  }
}
