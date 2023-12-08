import { createOpponents } from "../constructors";
import { Canvas, DrawObjProps } from "../helpers/types";
import { Opponent } from "./Opponent";

export class OpponentManager {
  opponents: Opponent[];

  constructor() {
    this.opponents = createOpponents(1);
  }

  update(elapsedTime: number) {
    this.opponents.forEach((o) => o.update(elapsedTime));
  }

  draw(drawProps: DrawObjProps) {
    this.opponents.forEach((o) => o.draw(drawProps));
  }

  reset(level: number) {
    this.opponents = createOpponents(level);
  }
}
