import { CharVectorManager } from "../CharVectorManager";
import { CharAction, Coordinates } from "../models";

export class OpponentVectorManager extends CharVectorManager {
  constructor(pos: Coordinates, moveSpeed: number, radius: number) {
    super(pos, moveSpeed, radius);
    this.setVelX(moveSpeed);
  }

  move(action: CharAction) {
    if (action === "MoveRight") {
      this.velocity.x = this.moveSpeed;
    }
    if (action === "MoveLeft") {
      this.velocity.x = -this.moveSpeed;
    }
    if (action === "StopX") this.velocity.x = 0;

    if (action === "Jump") {
      this.velocity.y = -15;
    }
  }
}
