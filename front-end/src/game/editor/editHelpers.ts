import {LevelMap} from "../loopShared/models"
import {Coors, Id} from "../entities/entityTypes"
import {levelToEntities} from "../helpers"
import {emptyTime, TimerUp} from "../state/timeHelpers"
import {Entity} from "../entities/Entity"

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0]
  curr[1] += increment[1]
}

export type EventState = {prev: boolean; curr: boolean}
export type DragState = {prev: Coors | null; curr: Coors | null}

export type Edges = {x: "left" | "right" | null; y: "top" | "bottom" | null}

export type ResizeEntity = {
  state: "hover" | "drag"
  entityId: Id
  proposed: Entity
  edge: Edges
}

export type UserInput = {
  shift: EventState
  ctrl: EventState
  delete: EventState
  mousePutDown: DragState
  mouseDown: EventState
  mouseUp: DragState
  mousePos: DragState
  copy: boolean
  undo: boolean
  redo: boolean
}
export const emptyUserInput = (): UserInput => ({
  shift: {prev: false, curr: false},
  ctrl: {prev: false, curr: false},
  delete: {prev: false, curr: false},
  mouseDown: {prev: false, curr: false},
  mousePutDown: {prev: null, curr: null},
  mouseUp: {prev: null, curr: null},
  mousePos: {prev: null, curr: null},
  copy: false,
  undo: false,
  redo: false
})

export type GameStateEditProps = {
  prevBaseColor: string
  time: {
    deltaT: number
    prevStamp: number
  }
  timers: {
    sinceLastSave: TimerUp
    sinceLastSaveCamPos: TimerUp
    sinceLastUndoRedo: TimerUp
  }
}

export const levelInfoToEditState = (level: LevelMap): GameStateEditProps => ({
  prevBaseColor: level.platformColor,
  time: {
    deltaT: 0,
    prevStamp: performance.now()
  },
  timers: {
    sinceLastSave: emptyTime("up"),
    sinceLastSaveCamPos: emptyTime("up"),
    sinceLastUndoRedo: emptyTime("up")
  }
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
