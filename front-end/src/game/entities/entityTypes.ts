import {Keys, PlayStats, WinState} from "../loopShared/models"
import {TimerDown, TimerUp} from "../state/timeHelpers"
import {Ammo} from "./Ammo"
import {Bullet} from "./bullet"
import {Champ} from "./champ"
import {EndGate} from "./endGate"
import {Groog} from "./groog"
import {Floor, Platform} from "./platform"

export type GameStateProps = {
  currStateOfGame: WinState
  camera: Camera
  time: {
    deltaT: number
    prevStamp: number
  }
  timers: {
    nextLevelTimer: TimerDown
  }
  stats: {
    score: {curr: number; prev: number}
    lives: {curr: number; prev: number}
    level: {curr: number; prev: number}
    ammo: {curr: number; prev: number}
  }
  entities: Entity[]
  keys: Keys
}

export type EntityType =
  | "player"
  | "groog"
  | "floor"
  | "platform"
  | "bullet"
  | "ammo"
  | "endGate"

export type EntityOfType = {
  player: Champ
  groog: Groog
  floor: Floor
  platform: Platform
  bullet: Bullet
  ammo: Ammo
  endGate: EndGate
}

export type Entity = {
  id: Id
  typeId: EntityType
  step: (deltaT: number) => void
  render: (cxt: CanvasRenderingContext2D) => void
  state: {
    position: CurrAndPrev
    dimensions: Coors
    dead: boolean
  }
  handleInteraction?: (entities: Entity[]) => void
  modifyStatsOnDeath?: Partial<PlayStats>
}
export type Camera = {
  // offset
  position: Coors
  velocity: Coors
  time: {
    idleTime: TimerUp
  }
}

export type Id = string

export type Coors = [number, number]

export type CurrAndPrev = {
  prev: Coors
  curr: Coors
}
