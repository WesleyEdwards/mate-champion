import {Coors} from "../game/entities/entityTypes"

export type User = {
  _id: string
  name: string
  email?: string | undefined
  highScore: number
  userType: "User" | "Editor" | "Admin"
}

export type LoginBody = {
  email: string
  code: string
}

export type CreateAccount = {
  email: string
  name?: string
  highScore?: number
}

export type LoginResponse = {
  user: User
  token: string
}

export type Score = {
  _id: string
  userId: string
  score: number
}

export type HasId = {
  _id: string
}

export type Condition<T> =
  | {Equal: T}
  | {Assign: T}
  | {Inside: T[]}
  | {Or: Array<Condition<T>>}
  | {And: Array<Condition<T>>}
  | {Always: true}
  | (T extends object ? {[P in keyof T]?: Condition<T[P]>} : never)

export type TopScore = {
  name: string
  score: number
}

export type TimedEvent = {
  time: number
  type: "Time" | "None" | "Random"
}
export type GroogInfo = {
  position: Coors
  moveSpeed: number // Positive
  facingRight: boolean
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
