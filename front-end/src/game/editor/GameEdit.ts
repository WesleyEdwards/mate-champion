import { FullLevelInfo } from "../loopShared/models";
import { Champ } from "../entities/champ";
import { Coors, Entity, Id } from "../entities/entityTypes";
import { renderBg } from "../render/background";
import { accountForPosition } from "../render/helpers";
import { updateTime } from "../state/helpers";
import { updateTimers } from "../state/timeHelpers";
import {
  addEntityToState,
  editStateToLevelInfo,
  GameStateEditProps,
  incrementPosition,
  levelInfoToEditState,
  toRounded,
  updateCurrPrevBool,
  updateCurrPrevDragState,
  withCamPosition,
} from "./editHelpers";
import { addDevEventListeners } from "./eventListeners";
import { Groog } from "../entities/groog";

export class GameEdit {
  state: GameStateEditProps;
  movingEntities: Set<Id> = new Set();
  selectedEntities: Set<Id> = new Set();
  hoveringEntities: Set<Id> = new Set();
  champ: Champ = new Champ([400, 400]);
  isDirty: boolean = false;

  constructor(
    currentLevel: FullLevelInfo,
    private setIsDirty: () => void,
    private setLevels: (level: Partial<FullLevelInfo>) => void,
    private canvas: HTMLCanvasElement
  ) {
    this.state = levelInfoToEditState(currentLevel);
    addDevEventListeners(this, canvas);
    // https://css-tricks.com/almanac/properties/c/cursor/
    canvas.style.cursor = "move";
  }

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp);
    updateTimers(this.state.timers, this.state.time.deltaT);

    if (this.state.timers.sinceLastSave.val > 10_000) {
      this.state.timers.sinceLastSave.val = 0;
      this.setLevels(editStateToLevelInfo(this.state));
      this.isDirty = false;
    }
    if (this.isDirty) {
      this.setIsDirty();
    }

    this.hoveringEntities = this.hoverEntities();

    if (this.state.keys.ctrl.curr) {
      if (this.hoveringEntities.size > 0) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "crosshair";
      }
    } else if (this.hoveringEntities.size > 0 || this.movingEntities.size > 0) {
      this.canvas.style.cursor = "grab";
    } else {
      this.canvas.style.cursor = "auto";
    }

    // this.state.keys.shift.curr && this.state.keys.mouseDown.curr;
    const guaranteeMovingCanvas =
      this.state.keys.mouseDown.curr && this.state.keys.shift.curr;
    const isMovingCanvas =
      this.movingEntities.size === 0 &&
      ((this.state.keys.mouseDown.curr && this.hoveringEntities.size === 0) ||
        guaranteeMovingCanvas);

    const mouseDownAction =
      this.state.keys.mouseDown.curr && !this.state.keys.mouseDown.prev;

    const mouseUpAction =
      this.state.keys.mouseUp.curr && !this.state.keys.mouseUp.prev;

    const startingToGrab = !guaranteeMovingCanvas && mouseDownAction;

    const stopGrabbing = !this.state.keys.mouseDown.curr;

    const addEntity =
      this.state.keys.ctrl.curr &&
      this.state.keys.mouseUp.curr &&
      this.hoveringEntities.size === 0;

    if (startingToGrab) {
      if (
        this.state.keys.ctrl.curr === false &&
        this.selectedEntities.intersection(this.hoveringEntities).size === 0
      ) {
        this.selectedEntities.clear(); // unselect when not ctrl click or when
      }

      this.hoveringEntities.forEach((h) => {
        this.selectedEntities.add(h);
      });
      this.movingEntities = new Set(this.selectedEntities);
    } else if (stopGrabbing) {
      this.movingEntities.clear();
    }

    if (isMovingCanvas) {
      this.canvas.style.cursor = "move";
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          -this.state.keys.mousePos.curr[0] + this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1],
        ];
        const proposedPos: Coors = [
          this.state.camera.position[0] + diff[0],
          this.state.camera.position[1] + diff[1],
        ];
        if (proposedPos[0] < -200 || proposedPos[0] > 10_000) {
          diff[0] = 0;
        }
        if (proposedPos[1] < 0 || proposedPos[1] > 500) {
          diff[1] = 0;
        }
        window.debounceLog(proposedPos[1]);
        incrementPosition(this.state.camera.position, diff);
      }
    } else if (this.movingEntities.size > 0) {
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          this.state.keys.mousePos.curr[0] - this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1],
        ];
        this.movingEntities.forEach((entity) => {
          const e = this.fromId(entity);
          if (!e) return;
          const d: Coors = e.typeId === "floor" ? [diff[0], 0] : [...diff];
          incrementPosition(e.state.position.curr, d);
          this.isDirty = true;
        });
      }
    } else if (addEntity) {
      addEntityToState(this);
      this.isDirty = true;
    }

    if (this.state.entities.some((e) => e.state.dead)) {
      this.state.entities = this.state.entities.filter((e) => !e.state.dead);
    }

    if (this.state.keys.delete.curr) {
      this.state.entities = this.state.entities.filter((e) => {
        return !this.selectedEntities.has(e.id);
      });
      this.state.keys.delete.curr = false;
    }

    Object.values(this.state.keys).forEach((o) => {
      if (typeof o.curr === "boolean") {
        updateCurrPrevBool(o);
      } else {
        updateCurrPrevDragState(o as any);
      }
    });

    if (mouseUpAction) {
      // lock rounded into place.
      this.state.entities.forEach((e) => {
        e.state.position.curr = toRounded(e.state.position.curr);
      });
    }

    // Fix entities
    this.state.entities.forEach((entity) => {
      if (entity instanceof Groog) {
        entity.state.facing = entity.state.velocity[0] > 0 ? "right" : "left";
      }
    });

    this.state.keys.mouseUp.curr = null;
  }

  hoverEntities(): Set<Id> {
    if (!this.state.keys.mousePos.curr) {
      return new Set();
    }
    const mouse = withCamPosition(
      this.state.keys.mousePos.curr,
      this.state.camera
    );
    return new Set(
      this.state.entities
        .filter((e) => {
          const isX =
            e.state.position.curr[0] < mouse[0] &&
            e.state.position.curr[0] + e.state.dimensions[0] > mouse[0];
          const isY =
            e.state.position.curr[1] < mouse[1] &&
            e.state.position.curr[1] + e.state.dimensions[1] > mouse[1];
          return isX && isY;
        })
        .map(this.toId)
    );
  }

  toId(entity: Entity) {
    return entity.id;
  }

  fromId(entity: Id): Entity | undefined {
    return this.state.entities.find((e) => e.id === entity);
  }

  get currentlySelected(): Entity[] {
    return [...this.selectedEntities]
      .map((e) => this.fromId(e))
      .filter(Boolean) as Entity[];
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
    const camPos = this.state.camera.position;
    cxt.save();
    cxt.translate(-camPos[0], camPos[1]);

    renderBg(this.state.camera, cxt);

    for (const entity of this.state.entities) {
      cxt.save();
      accountForPosition(toRounded(entity.state.position.curr), cxt);
      entity.render(cxt);

      if (this.selectedEntities.has(entity.id)) {
        cxt.strokeStyle = "red";
        cxt.lineWidth = 2;

        cxt.strokeRect(
          0,
          0,
          entity.state.dimensions[0],
          entity.state.dimensions[1]
        );
      }
      cxt.restore();
    }
    cxt.save();
    accountForPosition([400, 400], cxt);
    this.champ.render(cxt);
    cxt.restore();

    cxt.restore();
  }

  setEventState<K extends keyof GameStateEditProps["keys"]>(
    key: K,
    value: GameStateEditProps["keys"][K]["curr"]
  ) {
    this.state.keys[key].curr = value;
  }
}
