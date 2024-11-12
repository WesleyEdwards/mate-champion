import {MAX_CANVAS_HEIGHT, platformConst} from "../loopShared/constants"
import {LevelMap} from "../loopShared/models"
import {
  Camera,
  Coors,
  CurrAndPrev,
  EntityOfType,
  Id
} from "../entities/entityTypes"
import {levelToEntities} from "../helpers"
import {emptyTime, TimerUp} from "../state/timeHelpers"
import {Entity} from "../entities/Entity"

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0]
  curr[1] += increment[1]
}

export const withCamPosition = (curr: Coors, cam: Camera): Coors => {
  return [curr[0] + cam.position[0], curr[1] - cam.position[1]]
}

export type EventState = {prev: boolean; curr: boolean}
export type DragState = {prev: Coors | null; curr: Coors | null}

export type Edge = "bottom" | "top" | "left" | "right"
export type Edges = {x: "left" | "right" | null; y: "top" | "bottom" | null}

export type ResizeEntity = {
  state: "hover" | "drag"
  entityId: Id
  proposed: Entity
  edge: Edges
}

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

export function toRounded(pos: Coors): Coors {
  const roundTo = 10
  const valX = Math.ceil(pos[0] / roundTo) * roundTo
  const valY = Math.ceil(pos[1] / roundTo) * roundTo
  return [valX, valY]
}

export function toRoundedNum(num: number): number {
  const roundTo = 10
  const val = Math.ceil(num / roundTo) * roundTo
  return val
}
