import { FullLevelInfo, SetUI } from "../loopShared/models";
import { Champ } from "../entities/champ";
import { EndGate } from "../entities/endGate";
import { GameStateProps, Entity } from "../entities/entityTypes";
import { initGameState, levelToEntities } from "../helpers";
import { renderBg } from "../render/background";
import { accountForPosition } from "../render/helpers";
import { SpacialHashGrid } from "../spacialHashGrid";
import { updateCamera } from "../state/camera";
import { updateTime } from "../state/helpers";
import { reconcileActions } from "../state/reconcileActions";
import { updateTimers } from "../state/timeHelpers";

export class GamePreviewer {
  gridHash: SpacialHashGrid = new SpacialHashGrid([-100, 4000], [20, 20]);
  state: GameStateProps = initGameState();

  constructor(private level: FullLevelInfo) {
    this.startLevel();
  }

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp);
    updateTimers(this.state.timers, this.state.time.deltaT);

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
        if (
          entity.state.position.curr[0] > this.level.endPosition ||
          entity.state.dead
        ) {
          this.startLevel();
        }
      }
    }

    reconcileActions(this.state);

    if (this.state.entities.some((e) => e.state.dead)) {
      const dead = this.state.entities.filter((e) => e.state.dead);
      this.state.entities = this.state.entities.filter((e) => !e.state.dead);
      for (const d of dead) {
        if (d.modifyStatsOnDeath) {
          for (const [k, v] of Object.entries(d.modifyStatsOnDeath)) {
            if (v) this.state.stats[k].curr += v;
          }
        }
        this.gridHash.removeClient(d);
      }
    }
  }

  startLevel() {
    this.state.camera.position = [0, 0];
    this.gridHash.dropAll();
    this.state.entities.length = 0;

    this.addEntity(new Champ([400, 400]));
    this.addEntity(new EndGate([this.level.endPosition, 0]));
    for (const entity of levelToEntities(this.level)) {
      this.addEntity(entity);
    }
    this.state.keys.toJump = 0;
    this.state.keys.toShank = 0;
    this.state.keys.toShoot = 0;
    this.state.currStateOfGame = "playing";
  }

  addEntity(e: Entity) {
    this.gridHash.newClient(e);
    this.state.entities.push(e);
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
    const camPos = this.state.camera.position;

    cxt.save();
    cxt.translate(-camPos[0], camPos[1]);

    renderBg(this.state.camera, cxt);

    for (const entity of this.state.entities) {
      cxt.save();
      accountForPosition(entity.state.position.curr, cxt);
      entity.render(cxt);

      cxt.restore();
    }
    cxt.restore();
  }
}
