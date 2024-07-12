import { Coordinates } from "../../Game/models";
import { Timer, updatePosAndVel, updateTimers } from "./timeHelpers";

export type CurrAndPrev = {
  prev: Coordinates;
  curr: Coordinates;
};

export const emptyCoors = (): Coordinates => {
  return { x: 0, y: 0 };
};

export const distBetween = (a: Coordinates, b: Coordinates) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export type Entity<TIMERS extends Record<string, Timer>> = {
  velocity: Coordinates;
  position: CurrAndPrev;
  timers: TIMERS;
};

export const updateEntity = <T extends Entity<any>>(
  entity: T,
  deltaT: number
) => {
  updatePosAndVel(entity.position, entity.velocity, deltaT);
  updateTimers(entity.timers, deltaT);
};
