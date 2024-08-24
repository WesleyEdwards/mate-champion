import { platformConst } from "../loopShared/constants";
import { devSettings } from "../loopShared/devTools/devSettings";
import { FullLevelInfo } from "../loopShared/models";
import { Camera, Coors, Entity } from "../entities/entityTypes";
import { levelToEntities, toCurrAndPrev } from "../helpers";
import { Floor, floorConst, Platform } from "../entities/platform";
import { emptyTime, Timer, TimerUp } from "../state/timeHelpers";
import { GameEdit } from "./GameEdit";
import { Groog1 } from "../entities/groog";
import { Ammo } from "../entities/Ammo";
import { AddableEntity } from "../../components/CourseBuilderSettings";

export const addEntityToState = (gs: GameEdit) => {
  if (!gs.state.keys.mouseUp.curr) return;

  const addable: Record<AddableEntity, Entity> = {
    groog: new Groog1([0, 0], [0.3, 0]),
    floor: new Floor({
      color: "blue",
      position: toCurrAndPrev([0, 0]),
      dimensions: [1000, floorConst.floorHeight],
      dead: false,
    }),
    platform: new Platform({
      color: "blue",
      position: toCurrAndPrev([0, 0]),
      dimensions: [300, platformConst.defaultHeight],
      dead: false,
    }),

    ammo: new Ammo([0, 0]),
  };

  const toAdd = devSettings().modifyingItem;
  if (toAdd === "endGate") return;

  const entity = addable[toAdd];
  const pos = gs.state.keys.mouseUp.curr;

  const center: Coors = [
    pos[0] - entity.state.dimensions[0] / 2,
    pos[1] - entity.state.dimensions[1] / 2,
  ];

  entity.state.position = toCurrAndPrev(
    withCamPosition(center, gs.state.camera)
  );

  if (entity.typeId === "floor") {
    // Should probably do this higher up in the fun, but this works for now
    entity.state.position.curr[1] = floorConst.floorY;
  }
  gs.state.entities.push(entity);
};

export const toRounded = (pos: Coors): Coors => {
  const roundTo = 10;
  const valX = Math.ceil(pos[0] / roundTo) * roundTo;
  const valY = Math.ceil(pos[1] / roundTo) * roundTo;
  return [valX, valY];
};

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0];
  curr[1] += increment[1];
};

export const withCamPosition = (curr: Coors, cam: Camera): Coors => {
  return [curr[0] + cam.position[0], curr[1] - cam.position[1]];
};

export type EventState = { prev: boolean; curr: boolean };
export type DragState = { prev: Coors | null; curr: Coors | null };

export type GameStateEditProps = {
  entities: Entity[];
  endPosition: number;
  camera: Camera;
  time: {
    deltaT: number;
    prevStamp: number;
  };
  timers: {
    sinceLastSave: TimerUp;
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

export const levelInfoToEditState = (
  level: FullLevelInfo
): GameStateEditProps => {
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
    timers: {
      sinceLastSave: emptyTime("up"),
    },
    keys: {
      shift: { prev: false, curr: false },
      ctrl: { prev: false, curr: false },
      delete: { prev: false, curr: false },
      mouseDown: { prev: false, curr: false },
      mouseUp: { prev: null, curr: null },
      mousePos: { prev: null, curr: null },
    },
    endPosition: level.endPosition,
  };
};

export const editStateToLevelInfo = (
  gs: GameStateEditProps
): Partial<FullLevelInfo> => {
  return {
    endPosition: gs.endPosition,
    floors: gs.entities
      .filter((e) => e.typeId === "floor")
      .map((f) => ({
        x: f.state.position.curr[0],
        width: f.state.dimensions[0],
        color: (f as Floor).state.color,
      })),
    platforms: gs.entities
      .filter((e) => e.typeId === "platform")
      .map((f) => ({
        x: f.state.position.curr[0],
        y: f.state.position.curr[1],
        width: f.state.dimensions[0],
        height: f.state.dimensions[1],
        color: (f as Platform).state.color,
      })),
    opponents: {
      grog: gs.entities
        .filter((e) => e.typeId === "groog")
        .map((g) => ({
          initPos: { x: g.state.position.curr[0], y: g.state.position.curr[1] },
          moveSpeed: (g as Groog1).state.velocity[0],
          jumpOften: false,
        })),
    },
    packages: gs.entities
      .filter((e) => e.typeId === "ammo")
      .map((p) => ({
        x: p.state.position.curr[0],
        y: p.state.position.curr[1],
      })),
  };
};
