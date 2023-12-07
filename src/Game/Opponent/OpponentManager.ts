import { END_POS, OPP_PER_LEVEL, opponentConst } from "../constants";
import { generateRandomInt } from "../helpers/utils";
import { Opponent } from "./Opponent";

export class OpponentManager {
  opponents: Opponent[];
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.opponents = this.createOpponents(context, 1);
  }

  update(elapsedTime: number) {
    this.opponents.forEach((o) => o.update(elapsedTime));
  }

  draw() {
    this.opponents.forEach((o) => o.draw());
  }

  reset(canvas: CanvasRenderingContext2D, level: number) {
    this.opponents = this.createOpponents(canvas, level);
  }

  createOpponents(canvas: CanvasRenderingContext2D, level: number): Opponent[] {
    const moveSpeed = opponentConst.speedBase + level * 0.1;
    return new Array(OPP_PER_LEVEL * level)
      .fill(null)
      .map(
        () => new Opponent(canvas, generateRandomInt(500, END_POS), moveSpeed)
      );
  }
}
