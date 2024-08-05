import { platformConst } from "../../Game/constants";
import { devSettings } from "../../Game/devSettings";
import { EditableEntity } from "../../Game/devTools/CourseBuilderSettings";
import { FullLevelInfo } from "../../Game/models";
import { Camera, Coors, Entity } from "../entityTypes";
import { Groog1 } from "../groog";
import { levelToEntities, toCurrAndPrev } from "../helpers";
import { Floor1, floorConst, Platform1 } from "../platform";
import { emptyTime } from "../state/timeHelpers";
import { GameEdit } from "./GameEdit";

export const addEntityToState = (gs: GameEdit) => {
  if (!gs.state.keys.mouseUp.curr) return;
  const toAdd = devSettings().modifyingItem;

  const addable: Record<EditableEntity, Entity> = {
    groog: new Groog1([0, 0], [0.3, 0]),
    floor: new Floor1({
      color: "blue",
      position: toCurrAndPrev([0, 0]),
      dimensions: [300, floorConst.floorHeight],
      dead: false,
    }),
    platform: new Platform1({
      color: "blue",
      position: toCurrAndPrev([0, 0]),
      dimensions: [300, platformConst.floorHeight],
      dead: false,
    }),
  };

  gs.addEntity(addable[toAdd], gs.state.keys.mouseUp.curr);
};

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0];
  curr[1] += increment[1];
};

export const withCamPosition = (curr: Coors, cam: Camera): Coors => {
  return [curr[0] + cam.position[0], curr[1] - cam.position[1]];
};

export const initGameEditState = (level: FullLevelInfo): GameStateEditProps => {
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

export type EventState = { prev: boolean; curr: boolean };
export type DragState = { prev: Coors | null; curr: Coors | null };

export type GameStateEditProps = {
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

export const updateCurrPrevBool = (obj: { curr: boolean; prev: boolean }) => {
  obj.prev = obj.curr;
};

export const updateCurrPrevDragState = (obj: {
  curr: Coors | null;
  prev: Coors | null;
}) => {
  if (obj.curr === null) {
    obj.prev = obj.curr;
  } else {
    obj.prev = [...obj.curr];
  }
};
