import { Coordinates } from "../../Game/models";
import { CurrAndPrev } from "./helpers";

export type TimerUp = { count: "up"; val: number };
export type TimerDown = { count: "down"; val: number };

export type Timer = TimerUp | TimerDown;

export function emptyTime(count: "up"): TimerUp;
export function emptyTime(count: "down"): TimerDown;

export function emptyTime(count: "up" | "down"): Timer {
  return { count: count, val: 0 };
}

// export const emptyTime = <T extends "up" | "down">(
//   count: T
// ): T extends "up" ? TimerUp : TimerDown => {
//   return { count: count, val: 0 };
// };

const updateCurr = (currAndPrev: CurrAndPrev) => {
  currAndPrev.prev.x = currAndPrev.curr.x;
  currAndPrev.prev.y = currAndPrev.curr.y;
};

/**
 * Updates the position based on the velocity
 * @param pos
 * @param vel
 * @param deltaT
 */
export const updateWithTime = (
  pos: Coordinates,
  vel: Coordinates,
  deltaT: number
) => {
  pos.x += vel.x * deltaT;
  pos.y += vel.y * deltaT;
};

/**
 * Updates previous state and position based on velocity
 * @param pos
 * @param vel
 * @param deltaT
 */
export const updatePosAndVel = (
  pos: CurrAndPrev,
  vel: Coordinates,
  deltaT: number
) => {
  updateCurr(pos);
  updateWithTime(pos.curr, vel, deltaT);
};

export const updateTimers = (timers: Record<string, Timer>, deltaT: number) => {
  for (const obj in timers) {
    const curr = timers[obj];

    if (curr.count == "up") {
      curr.val += deltaT;
    } else if (curr.val > 0) {
      curr.val -= deltaT;
    }
  }
};
