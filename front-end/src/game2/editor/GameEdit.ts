import { getLevelInfo } from "../../Game/constructors";
import { FullLevelInfo } from "../../Game/models";
import { Camera, Coors, Entity, GameStateProps } from "../entityTypes";
import { initGameState, levelToEntities, toCurrAndPrev } from "../helpers";
import { Platform1 } from "../platform";
import { renderBg } from "../render/background";
import { accountForPosition } from "../render/helpers";
import { updateCamera } from "../state/camera";
import { updateTime } from "../state/helpers";
import { emptyTime, updateTimers } from "../state/timeHelpers";
import { addDevEventListeners } from "./eventListeners";

export class GameEdit {
  state: GameStateEditProps;
  constructor(
    private currentLevel: FullLevelInfo,
    private setLevels: (level: Partial<FullLevelInfo>) => void,
    canvas: HTMLCanvasElement
  ) {
    this.state = initGameEditState(currentLevel);
    addDevEventListeners(this, canvas);
  }

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp); // window.debounceLog(this.state.camera.position);
    // window.debounceLog(this.state.keys);

    if (this.state.keys.shift.curr && this.state.keys.mouseDown.curr) {
      if (this.state.keys.mouseDrag.curr && this.state.keys.mouseDrag.prev) {
        const diff: Coors = [
          this.state.keys.mouseDrag.curr[0] - this.state.keys.mouseDrag.prev[0],
          this.state.keys.mouseDrag.curr[1] - this.state.keys.mouseDrag.prev[1],
        ];
        if (this.state.camera.position[0] - diff[0] < -200) {
          diff[0] = 0;
        }
        if (this.state.camera.position[1] + diff[1] < 0) {
          diff[1] = 0;
        }
        incrementPosition(this.state.camera.position, diff);
      }
    }

    if (this.state.keys.ctrl.curr) {
      if (this.state.keys.mouseUp.curr) {
        this.addEntity(
          new Platform1({
            color: "blue",
            dead: false,
            dimensions: [100, 100],
            position: toCurrAndPrev([0, 0]),
          }),
          this.state.keys.mouseUp.curr
        );
      }
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
  curr[0] -= increment[0];
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
      mouseDrag: { prev: null, curr: null },
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
    mouseDrag: DragState;
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
