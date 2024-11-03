import {MAX_CANVAS_HEIGHT, platformConst} from "../loopShared/constants"
import {LevelMap} from "../loopShared/models"
import {Camera, Coors, CurrAndPrev, EntityOfType} from "../entities/entityTypes"
import {levelToEntities} from "../helpers"
import {Floor, Platform} from "../entities/platform"
import {emptyTime, TimerUp} from "../state/timeHelpers"
import {Groog} from "../entities/groog"
import {Ammo} from "../entities/Ammo"
import {AddableEntity} from "../../components/GameEdit/CourseBuilderSettings"
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
