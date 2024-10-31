import {MAX_CANVAS_HEIGHT, platformConst} from "../loopShared/constants"
import {LevelMap} from "../loopShared/models"
import {
  Camera,
  Coors,
  CurrAndPrev,
  Entity,
  EntityOfType
} from "../entities/entityTypes"
import {levelToEntities} from "../helpers"
import {Floor, Platform} from "../entities/platform"
import {emptyTime, TimerUp} from "../state/timeHelpers"
import {Groog} from "../entities/groog"
import {Ammo} from "../entities/Ammo"
import {AddableEntity} from "../../components/GameEdit/CourseBuilderSettings"

export const copyEntity = (e: Entity): Entity | undefined => {
  if (
    e.typeId === "endGate" ||
    e.typeId === "player" ||
    e.typeId === "floor" ||
    e.typeId === "bullet"
  ) {
    return undefined
  }
  const copyOfWithOffset = (coors: CurrAndPrev): Coors => {
    const correctForY = coors.curr[0] + 80 > MAX_CANVAS_HEIGHT ? -100 : 100
    return [coors.curr[0] + 100, coors.curr[1] + correctForY]
  }

  const map: {
    [K in AddableEntity]: (old: EntityOfType[K]) => EntityOfType[K]
  } = {
    groog: (old) =>
      new Groog({
        moveSpeed: old.state.velocity[0],
        position: copyOfWithOffset(old.state.position),
        timeBetweenJump: old.state.timeBetweenJump,
        timeBetweenTurn: old.state.timeBetweenTurn
      }),
    floor: (old) =>
      new Floor({
        color: old.state.color,
        startX: old.state.position.curr[0],
        width: old.state.dimensions[0]
      }),
    platform: (old) =>
      new Platform({
        color: old.state.color,
        dimensions: [old.state.dimensions[0], old.state.dimensions[1]],
        position: copyOfWithOffset(old.state.position)
      }),
    ammo: (old) => new Ammo(old.state.position.curr)
  }
  return map[e.typeId](e as never)
}

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0]
  curr[1] += increment[1]
}

export const withCamPosition = (curr: Coors, cam: Camera): Coors => {
  return [curr[0] + cam.position[0], curr[1] - cam.position[1]]
}

export type EventState = {prev: boolean; curr: boolean}
export type DragState = {prev: Coors | null; curr: Coors | null}

export type GameStateEditProps = {
  entities: Entity[]
  prevBaseColor: string
  endPosition: number
  camera: Camera
  time: {
    deltaT: number
    prevStamp: number
  }
  timers: {
    sinceLastSave: TimerUp
  }
  keys: {
    shift: EventState
    ctrl: EventState
    delete: EventState
    mouseDown: EventState
    copy: EventState
    mouseUp: DragState
    mousePos: DragState
  }
}

export const levelInfoToEditState = (level: LevelMap): GameStateEditProps => ({
  entities: levelToEntities({...level}),
  prevBaseColor: level.platformColor,
  camera: {
    time: {
      idleTime: emptyTime("up")
    },
    position: [0, 0],
    velocity: [0, 0]
  },
  time: {
    deltaT: 0,
    prevStamp: performance.now()
  },
  timers: {
    sinceLastSave: emptyTime("up")
  },
  keys: {
    shift: {prev: false, curr: false},
    ctrl: {prev: false, curr: false},
    delete: {prev: false, curr: false},
    copy: {prev: false, curr: false},
    mouseDown: {prev: false, curr: false},
    mouseUp: {prev: null, curr: null},
    mousePos: {prev: null, curr: null}
  },
  endPosition: level.endPosition
})
