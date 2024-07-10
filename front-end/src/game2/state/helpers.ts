import { Coordinates } from "../../Game/models";

export type CurrAndPrev = {
  prev: Coordinates;
  curr: Coordinates;
};

export const emptyCoors = (): Coordinates => {
  return { x: 0, y: 0 };
};


export const distBetween = (a: Coordinates, b: Coordinates) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
