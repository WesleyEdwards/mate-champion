import { Coordinates } from "../../Game/models";
import { Timer } from "../champ";

export type CurrAndPrev = {
  prev: Coordinates;
  curr: Coordinates;
};

export const emptyCoors = (): Coordinates => {
  return { x: 0, y: 0 };
};

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
  vel: CurrAndPrev,
  deltaT: number
) => {
  updateCurr(pos);
  updateCurr(vel);

  updateWithTime(pos.curr, vel.curr, deltaT);
};

export type HasPos = {
  position: Coordinates | CurrAndPrev;
};

export const updateTimers = (timers: Record<string, Timer>, deltaT: number) => {
  for (const obj in timers) {
    const curr = timers[obj];

    if (curr.countUp) {
      curr.val += deltaT;
    } else if (curr.val > 0) {
      curr.val -= deltaT;
    }
  }
};
