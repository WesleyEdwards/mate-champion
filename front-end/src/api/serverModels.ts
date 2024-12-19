import {Coors} from "../game/entities/entityTypes"


export type TimedEvent = {
  time: number
  type: "Time" | "None" | "Random"
}
export type GroogInfo = {
  position: Coors
  moveSpeed: number
  timeBetweenJump: TimedEvent
  timeBetweenTurn: TimedEvent
}

export type LevelMap = {
  _id: string
  endPosition: number
  champInitPos: Coors
  packages: Coors[]
  groog: GroogInfo[]
  platformColor: string
  platforms: {
    dimensions: Coors
    position: Coors
    color: string | null | undefined
  }[]
  floors: {
    x: number
    width: number
  }[]
}

export type LevelInfo = {
  _id: string
  description: string | null | undefined
  owner: string
  public: boolean
  creatorName: string
  name: string
}
