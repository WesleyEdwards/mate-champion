import { displayNextLevel, renderBg } from "./render/background";
import { accountForPosition } from "./render/helpers";
import { SpacialHashGrid } from "./spacialHashGrid";
import { reconcileActions } from "./state/reconcileActions";
import { updateCamera } from "./state/camera";
import { TimerDown, updateTimers } from "./state/timeHelpers";
import { Champ1 } from "./champ";
import {
  gameStateConst,
  initGameState,
  levelToEntities,
  toCurrAndPrev,
  uiIsDirty,
  updateStats,
} from "./helpers";
import { getLevelInfo } from "../Game/constructors";
import { Entity, GameStateProps } from "./entityTypes";
import { FullLevelInfo, SetUI } from "../Game/models";
import { updateTime } from "./state/helpers";
import { EndGate } from "./endGate";

export class Game {
  gridHash: SpacialHashGrid = new SpacialHashGrid([-100, 4000], [20, 20]);
  state: GameStateProps = initGameState();

  constructor(private levels: FullLevelInfo[], private setUi: SetUI) {}

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp);
    updateTimers(this.state.timers, this.state.time.deltaT);
    if (uiIsDirty(this.state.stats)) {
      this.setUi.modifyStats({
        level: this.state.stats.level.curr,
        lives: this.state.stats.lives.curr,
        score: this.state.stats.score.curr,
        ammo: this.state.stats.ammo.curr,
      });
      updateStats(this.state.stats);
    }

    if (this.state.currStateOfGame === "playing") {
      this.stepGamePlay();
    } else {
      if (this.state.timers.nextLevelTimer.val <= 0) {
        if (
          this.state.currStateOfGame === "loseLife" &&
          this.state.stats.lives.curr <= 0
        ) {
          this.state.currStateOfGame = "lose";
        } else {
          this.startLevel();
        }
      }
    }
  }

  stepGamePlay() {
    updateCamera(this.state.camera, this.state.time.deltaT);
    for (const entity of this.state.entities) {
      this.gridHash.updateClient(entity);
      if (entity.handleInteraction) {
        const near = this.gridHash.findNear(entity);
        entity.handleInteraction?.(
          this.state.entities.filter((e) => near.includes(e.id))
        );
      }
      entity.step(this.state.time.deltaT);
      if (entity.typeId === "player") {
        this.updatePlayer(entity);
      }
    }

    reconcileActions(this.state);

    if (this.state.entities.some((e) => e.state.dead)) {
      const dead = this.state.entities.filter((e) => e.state.dead);
      this.state.entities = this.state.entities.filter((e) => !e.state.dead);
      for (const d of dead) {
        if (d.pointsGainWhenDead) {
          this.state.stats.score.curr += d.pointsGainWhenDead;
        }
        this.gridHash.removeClient(d);
      }
    }
  }

  updatePlayer(champ: Entity) {
    if (champ.state.dead) {
      this.state.currStateOfGame = "loseLife";
      this.state.stats.lives.curr -= 1;
      this.state.timers.nextLevelTimer.val = gameStateConst.showMessageTime;
    }
    if (champ.state.position.curr[0] > this.currentLevel.endPosition) {
      this.state.currStateOfGame = "nextLevel";
      this.state.timers.nextLevelTimer.val = gameStateConst.showMessageTime;
      this.state.stats.level.curr += 1;
    }
  }

  startLevel() {
    this.state.camera.position = [0, 0];
    this.gridHash.dropAll();
    this.state.entities.length = 0;

    this.addEntity(new Champ1(toCurrAndPrev([400, 400])));
    this.addEntity(new EndGate([this.currentLevel.endPosition, 0]));
    for (const entity of levelToEntities(this.currentLevel)) {
      this.addEntity(entity);
    }
    this.state.currStateOfGame = "playing";
  }

  get currentLevel() {
    return getLevelInfo(this.state.stats.level.curr, this.levels);
  }

  addEntity(e: Entity) {
    this.gridHash.newClient(e);
    this.state.entities.push(e);
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
    if (
      this.state.currStateOfGame === "nextLevel" ||
      this.state.currStateOfGame === "loseLife"
    ) {
      displayNextLevel(
        cxt,
        (() => {
          if (this.state.currStateOfGame === "loseLife") {
            if (this.state.stats.lives.curr === 0) {
              return "Game Over";
            }
            return "Try again";
          }
          return `Level ${this.state.stats.level.curr}`;
        })()
      );
      return;
    }

    const camPos = this.state.camera.position;

    cxt.save();
    cxt.translate(-camPos[0], camPos[1]);

    renderBg(this.state.camera, cxt);

    for (const entity of this.state.entities) {
      cxt.save();
      accountForPosition(entity.state.position.curr, cxt);
      entity.render(cxt);

      // cxt.strokeStyle = "red";
      // cxt.lineWidth = 2;

      // cxt.strokeRect(
      //   0,
      //   0,
      //   entity.state.dimensions[0],
      //   entity.state.dimensions[1]
      // );

      cxt.restore();
    }
    cxt.restore();
  }
}
