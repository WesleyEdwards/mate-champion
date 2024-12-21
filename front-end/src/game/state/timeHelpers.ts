import {Coors, CurrAndPrev} from "../entities/entityTypes"

export type TimerUp = {count: "up"; val: number}
export type TimerDown = {count: "down"; val: number}

export type Timer = TimerUp | TimerDown

export function emptyTime(count: "up"): TimerUp
export function emptyTime(count: "down", value?: number): TimerDown

export function emptyTime(count: "up" | "down", value?: number): Timer {
  return {count: count, val: value ?? 0}
}

/**
 * Updates the position based on the velocity
 * @param pos
 * @param vel
 * @param deltaT
 */
export const updateWithTime = (pos: Coors, vel: Coors, deltaT: number) => {
  pos[0] += vel[0] * deltaT
  pos[1] += vel[1] * deltaT
}

/**
 * Updates previous state and position based on velocity
 * @param pos
 * @param vel
 * @param deltaT
 */
export const updatePosAndVel = (
  pos: CurrAndPrev,
  vel: Coors,
  deltaT: number
) => {
  pos.prev[0] = pos.curr[0]
  pos.prev[1] = pos.curr[1]
  updateWithTime(pos.curr, vel, deltaT)
}

export const updateTimers = (timers: Record<string, Timer>, deltaT: number) => {
  for (const obj in timers) {
    const curr = timers[obj]

    if (curr.count == "up") {
      curr.val += deltaT
    } else if (curr.val > 0) {
      curr.val -= deltaT
    }
  }
}
