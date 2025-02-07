import {Coors, Id} from "../entities/entityTypes"
import {emptyTime, TimerUp} from "../state/timeHelpers"
import {Entity} from "../entities/Entity"
import {Adding} from "../../components/GameEdit/CourseBuilderSettings"
import {EditGlobal} from "../../App"
import {LevelMap} from "../../api/types"

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0]
  curr[1] += increment[1]
}
export const differenceBetween = (curr: Coors, increment: Coors): Coors => [
  curr[0] - increment[0],
  curr[1] - increment[1]
]

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
  undo: "undo" | "redo" | undefined
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
  undo: undefined
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

export function pointInsideEntity(
  e: Entity,
  point: Coors,
  distOutsideOfEntityThreshHold?: number
) {
  const dist = distOutsideOfEntityThreshHold ?? 0
  const isX = e.posLeft - dist < point[0] && e.posRight + dist > point[0]
  const isY = e.posTop - dist < point[1] && e.posBottom + dist > point[1]
  return isX && isY
}

export const areEqual = (a: Coors, b: Coors) => a[0] === b[0] && a[1] === b[1]

export const getGlobalEditing = (): EditGlobal => {
  if (window.editor) return window.editor
  return {
    addingEntity: {type: "platform", color: undefined, baseColor: undefined},
    editingEntities: [],
    action: undefined
  }
}

export const setGlobalEditing = <K extends keyof EditGlobal>(
  k: K,
  v: EditGlobal[K]
) => {
  if (window.editor) {
    window.editor[k] = v
  } else
    window.editor = {
      ...emptyGlobal(),
      [k]: v
    }
}

const emptyGlobal = (): EditGlobal => ({
  addingEntity: {type: "platform", color: undefined, baseColor: undefined},
  editingEntities: [],
  action: undefined
})
