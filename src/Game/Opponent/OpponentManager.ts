import { createOpponents } from "../constructors";
import { Canvas, DrawObjProps } from "../helpers/types";
import { Grog } from "./Grog";


export type Opponents = { grog: Grog[] };
export class OpponentManager {
  opponents: Opponents;

  constructor() {
    this.opponents = createOpponents(1);
  }

  update(elapsedTime: number) {
    this.opponents.grog.forEach((o) => o.update(elapsedTime));
  }

  draw(drawProps: DrawObjProps) {
    this.opponents.grog.forEach((o) => o.draw(drawProps));
  }

  reset(level: number) {
    this.opponents = createOpponents(level);
  }
}
