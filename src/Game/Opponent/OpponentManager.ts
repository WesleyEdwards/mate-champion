import { END_POS, OPP_PER_LEVEL, OPP_SPEED_BASE } from "../constants";
import { generateRandomInt } from "../utils";
import { Opponent } from "./Opponent";

export class OpponentManager {
  opponents: Opponent[] = this.createOpponents(1);
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  update(elapsedTime: number) {
    this.opponents.forEach((o) => o.update(elapsedTime));
  }

  draw() {
    this.opponents.forEach((o) => o.draw(this.context));
  }

  reset(level: number) {
    this.opponents = this.createOpponents(level);
  }

  createOpponents(level: number): Opponent[] {
    const moveSpeed = OPP_SPEED_BASE + level * 0.1;
    return new Array(OPP_PER_LEVEL * level)
      .fill(null)
      .map(() => new Opponent(generateRandomInt(500, END_POS), moveSpeed));
  }
}
