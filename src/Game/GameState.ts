import { initialKeyStatus, emptyStats, INCREMENT_VALUE } from "./constants";
import { drawComponents, updateWithPlayer } from "./GameStateFunctions";
import { Keys, GameStats, SetUI } from "./models";
import { ObjectManager } from "./ObjectManager/ObjectManager";

type winState = "win" | "lose" | "playing";

export class GameState {
  winState: winState;
  objectManager: ObjectManager;
  keys: Keys;
  private scrollOffset: number;
  private stats: GameStats;
  private setUI: SetUI;

  constructor(setUI: SetUI) {
    this.scrollOffset = 0;
    this.winState = "playing";
    this.keys = initialKeyStatus;
    this.objectManager = new ObjectManager();
    this.stats = { ...emptyStats };
    this.setUI = setUI;
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
    this.objectManager.reset(this.stats.level);
    this.drawStats();
  }

  private nextLevel() {
    this.stats.level++;
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

  enterGame() {
    this.setUI.setShowInstructions(false);
    this.reset(true);
  }

  updateEverything() {
    this.objectManager.updateAll(this.keys);
  }

  drawEverything(context: CanvasRenderingContext2D) {
    drawComponents(context, this.objectManager);
  }

  calcInteractions() {
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

    const shot = this.objectManager.calcBullets();
    if (shot) this.stats.ammo--;

    const nextLevel = this.objectManager.nextLevel;
    if (nextLevel) this.nextLevel();

    if (nextLevel || killedOpp || shot) {
      this.drawStats();
    }

    updateWithPlayer(
      this.keys,
      this.objectManager.player,
      this.scrollOffset,
      this.objectManager.objectsToUpdatePos
    );
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
  getScrollOffset() {
    return this.scrollOffset;
  }
  getScore() {
    return this.stats.score;
  }
}
