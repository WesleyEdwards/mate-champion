import { Keys, FullLevelInfo, SetUI } from "../models";
import { ObjectManager } from "./ObjectManager";
import { GameStatsManager } from "./GameStatsManager";
import { GameDrawer } from "./GameDrawer";
import { Canvas, WinState } from "../helpers/types";
import { addEventListeners } from "../helpers/eventListeners";
import { devSettings } from "../devSettings";
import { DevContentCreate } from "../devTools/DevContentCreate";
import { CameraDisplay } from "./CameraDisplay";
import { GameMode } from "../../hooks/useAuth";
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
  private cameraDisplay: CameraDisplay;
  private delayLevelTime: number;
  private gameMode: GameMode;

  constructor(
    setUI: SetUI,
    canvas: HTMLCanvasElement,
    cxt: CanvasRenderingContext2D,
    levels: FullLevelInfo[],
    gameMode: GameMode,
    setLevel?: (level: Partial<FullLevelInfo>) => void
  ) {
    this.keys = addEventListeners(() => {
      console.log("togglePause");
      const newState = this.currStateOfGame === "pause" ? "playing" : "pause";
      this.setUI.handlePause(newState === "pause");
      this.currStateOfGame = newState;
    });
    this.objectManager = new ObjectManager(levels, gameMode);
    this.objectManager.reset(1);
    this.setUI = setUI;
    this.gameDrawer = new GameDrawer();
    this.cxt = cxt;
    this.devContentCreate =
      gameMode === "edit"
        ? new DevContentCreate({
            canvas,
            objectManager: this.objectManager,
            setLevel,
          })
        : null;
    this.cameraDisplay = new CameraDisplay(gameMode);
    this.delayLevelTime = gameMode === "play" ? 2000 : 100;
    this.gameMode = gameMode;

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

    this.devContentCreate?.update(this.cameraDisplay.cameraOffset, timeStamp);
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
    if (window.window.mateSettings.showDevStats) {
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
    this.setUI.modifyStats({
      levelCreator:
        this.objectManager.levels.at(this.stats.level - 1)?.creatorName ?? "",
    });
  }

  private handleLoseLife() {
    if (window.window.mateSettings.invincibility) return;
    if (this.gameMode === "edit") return;
    this.currStateOfGame = "loseLife";
    if (this.gameMode !== "test") {
      this.stats.addLives(-1);
    }
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
    const showMessage = this.stats.timeInLevel < this.delayLevelTime;
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

  removeSetUi() {
    this.setUI = {
      handlePause: () => {},
      handleLose: () => {},
      modifyStats: () => {},
    };
    this.devContentCreate = null;
  }
}
