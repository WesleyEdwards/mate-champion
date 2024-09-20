import {Coors} from "../entities/entityTypes"

export type Keys = {
  up: boolean
  right: boolean
  left: boolean
  down: boolean
  jump: boolean
  shoot: boolean
  shank: boolean
  toJump: 0 | 1
  toShoot: 0 | 1
  toShank: 0 | 1
  mostRecentX: "left" | "right"
}

export type LevelMap = {
  _id: string
  endPosition: number
  packages: Coors[]
  opponents: {
    grog: {
      position: Coors
      moveSpeed: number
      jumpOften?: boolean
    }[]
  }
  platformColor: string
  platforms: {
    dimensions: Coors
    position: Coors
    color: string | null | undefined
  }[]
  floors: {
    x: number
    width: number
    color: string
  }[]
  createdAt: string
  updatedAt: string
}

export type LevelInfo = {
  _id: string
  description: string | null | undefined
  owner: string
  public: boolean
  creatorName: string
  name: string
  createdAt: string
  updatedAt: string
}

export type WinState = "lose" | "playing" | "initial" | "nextLevel" | "loseLife"

export type PlayStats = {
  score: number
  lives: number
  level: number
  ammo: number
}
