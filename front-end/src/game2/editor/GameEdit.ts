import { getLevelInfo } from "../../Game/constructors";
import { FullLevelInfo } from "../../Game/models";
import { Camera, Coors, Entity, GameStateProps, Id } from "../entityTypes";
import {
  areTouching1,
  initGameState,
  levelToEntities,
  toCurrAndPrev,
} from "../helpers";
import { Platform1 } from "../platform";
import { renderBg } from "../render/background";
import { accountForPosition } from "../render/helpers";
import { updateCamera } from "../state/camera";
import { updateTime } from "../state/helpers";
import { emptyTime, updateTimers } from "../state/timeHelpers";
import { addDevEventListeners } from "./eventListeners";

export class GameEdit {
  state: GameStateEditProps;
  movingEntities: Set<Id> = new Set();
  selectedEntities: Set<Id> = new Set();
  hoveringEntities: Set<Id> = new Set();

  constructor(
    private currentLevel: FullLevelInfo,
    private setLevels: (level: Partial<FullLevelInfo>) => void,
    private canvas: HTMLCanvasElement
  ) {
    this.state = initGameEditState(currentLevel);
    addDevEventListeners(this, canvas);
    // https://css-tricks.com/almanac/properties/c/cursor/
    canvas.style.cursor = "move";
  }

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp); // window.debounceLog(this.state.camera.position);

    this.hoveringEntities = this.hoverEntities();

    if (this.state.keys.shift.curr) {
      this.canvas.style.cursor = "move";
    } else if (this.state.keys.ctrl.curr) {
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

    const isMovingCanvas =
      this.state.keys.shift.curr && this.state.keys.mouseDown.curr;

    const mouseDownAction =
      this.state.keys.mouseDown.curr && !this.state.keys.mouseDown.prev;

    const mouseUpAction =
      this.state.keys.mouseUp.curr && !this.state.keys.mouseUp.prev;

    const startingToGrab = !isMovingCanvas && mouseDownAction;

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
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          -this.state.keys.mousePos.curr[0] + this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1],
        ];
        if (this.state.camera.position[0] + diff[0] < -200) {
          diff[0] = 0;
        }
        if (this.state.camera.position[1] + diff[1] < 0) {
          diff[1] = 0;
        }
        incrementPosition(this.state.camera.position, diff);
      }
    } else if (this.movingEntities.size > 0) {
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          this.state.keys.mousePos.curr[0] - this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1],
        ];
        this.movingEntities.forEach((entity) => {
          incrementPosition(this.fromId(entity).state.position.curr, diff);
        });
      }
    } else if (addEntity) {
      this.addEntity(
        new Platform1({
          color: "blue",
          dead: false,
          dimensions: [100, 100],
          position: toCurrAndPrev([0, 0]),
        }),
        this.state.keys.mouseUp.curr!
      );
    }

    if (this.state.entities.some((e) => e.state.dead)) {
      this.state.entities = this.state.entities.filter((e) => !e.state.dead);
    }

    Object.values(this.state.keys).forEach((o) => {
      if (typeof o.curr === "boolean") {
        updateCurrPrevBool(o);
      } else {
        updateCurrPrevDragState(o as any);
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

  fromId(entity: Id): Entity {
    return this.state.entities.find((e) => e.id === entity)!;
  }

  addEntity(entity: Entity, pos: Coors) {
    const center: Coors = [
      pos[0] - entity.state.dimensions[0] / 2,
      pos[1] - entity.state.dimensions[1] / 2,
    ];

    entity.state.position = toCurrAndPrev(
      withCamPosition(center, this.state.camera)
    );

    this.state.entities.push(entity);
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
    const camPos = this.state.camera.position;
    cxt.save();
    cxt.translate(-camPos[0], camPos[1]);

    renderBg(this.state.camera, cxt);

    for (const entity of this.state.entities) {
      cxt.save();
      accountForPosition(entity.state.position, cxt);
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
    cxt.restore();
  }

  setEventState<K extends keyof GameStateEditProps["keys"]>(
    key: K,
    value: GameStateEditProps["keys"][K]["curr"]
  ) {
    this.state.keys[key].curr = value;
  }
}

const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0];
  curr[1] += increment[1];
};

const withCamPosition = (curr: Coors, cam: Camera): Coors => {
  return [curr[0] + cam.position[0], curr[1] - cam.position[1]];
};

const initGameEditState = (level: FullLevelInfo): GameStateEditProps => {
  return {
    entities: levelToEntities({ ...level }),
    camera: {
      time: {
        idleTime: emptyTime("up"),
      },
      position: [0, 0],
      velocity: [0, 0],
    },
    time: {
      deltaT: 0,
      prevStamp: performance.now(),
    },
    keys: {
      shift: { prev: false, curr: false },
      ctrl: { prev: false, curr: false },
      delete: { prev: false, curr: false },
      mouseDown: { prev: false, curr: false },
      mouseUp: { prev: null, curr: null },
      mousePos: { prev: null, curr: null },
    },
  };
};

type EventState = { prev: boolean; curr: boolean };
type DragState = { prev: Coors | null; curr: Coors | null };

type GameStateEditProps = {
  entities: Entity[];
  camera: Camera;
  time: {
    deltaT: number;
    prevStamp: number;
  };
  keys: {
    shift: EventState;
    ctrl: EventState;
    delete: EventState;
    mouseDown: EventState;
    mouseUp: DragState;
    mousePos: DragState;
  };
};

const updateCurrPrevBool = (obj: { curr: boolean; prev: boolean }) => {
  obj.prev = obj.curr;
};

const updateCurrPrevDragState = (obj: {
  curr: Coors | null;
  prev: Coors | null;
}) => {
  if (obj.curr === null) {
    obj.prev = obj.curr;
  } else {
    obj.prev = [...obj.curr];
  }
};
