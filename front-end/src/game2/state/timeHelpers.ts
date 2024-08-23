import { Coordinates } from "../../Game/models";
import { Coors, CurrAndPrev } from "../entities/entityTypes";

export type TimerUp = { count: "up"; val: number };
export type TimerDown = { count: "down"; val: number };

export type Timer = TimerUp | TimerDown;

export function emptyTime(count: "up"): TimerUp;
export function emptyTime(count: "down"): TimerDown;

export function emptyTime(count: "up" | "down"): Timer {
  return { count: count, val: 0 };
}

const updateCurr = (currAndPrev: CurrAndPrev) => {
  currAndPrev.prev[0] = currAndPrev.curr[0];
  currAndPrev.prev[1] = currAndPrev.curr[1];
};

/**
 * Updates the position based on the velocity
 * @param pos
 * @param vel
 * @param deltaT
 */
export const updateWithTime = <T extends Coordinates | Coors>(
  pos: T,
  vel: T,
  deltaT: number
) => {
  if ("x" in pos && "x" in vel) {
    pos.x += vel.x * deltaT;
    pos.y += vel.y * deltaT;
  } else {
    (pos as Coors)[0] += (vel as Coors)[0] * deltaT;
    (pos as Coors)[1] += (vel as Coors)[1] * deltaT;
  }
};

/**
 * Updates previous state and position based on velocity
 * @param pos
 * @param vel
 * @param deltaT
 */
export const updatePosAndVel = (
  pos: CurrAndPrev,
  vel: Coordinates | Coors,
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
