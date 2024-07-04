import { Coordinates } from "../../Game/models";

export type CurrAndPrev = {
  prev: Coordinates;
  curr: Coordinates;
};

export const updateCurr = (currAndPrev: CurrAndPrev) => {
  currAndPrev.prev.x = currAndPrev.curr.x;
  currAndPrev.prev.y = currAndPrev.curr.y;
};
