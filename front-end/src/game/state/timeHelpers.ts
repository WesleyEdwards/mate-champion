import {Coors, CurrAndPrev} from "../entities/entityTypes"

export type TimerUp = {count: "up"; val: number}
export type TimerDown = {count: "down"; val: number}

export type Timer = TimerUp | TimerDown

export function emptyTime(count: "up"): TimerUp
export function emptyTime(count: "down"): TimerDown

export function emptyTime(count: "up" | "down"): Timer {
  return {count: count, val: 0}
}

const updateCurr = (currAndPrev: CurrAndPrev) => {
  currAndPrev.prev[0] = currAndPrev.curr[0]
  currAndPrev.prev[1] = currAndPrev.curr[1]
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
  updateCurr(pos)
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
