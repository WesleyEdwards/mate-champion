import {Coors, GameStateProps} from "../entities/entityTypes"

export const distBetween = (a: Coors, b: Coors) =>
  Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))

export const updateTime = (time: GameStateProps["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp
  time.deltaT = elapsed
  time.prevStamp = timeStamp
}

export type UpdateFun<T> = (entity: T, deltaT: number) => void

export type ActionMap<M extends {name: string}, E> = {
  [K in M["name"]]: (entity: E, action: Extract<M, {name: K}>) => void
}
