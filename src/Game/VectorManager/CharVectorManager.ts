import { BaseVectorMan } from "./BaseVectorMan";
import { Coordinates } from "../models";

export class CharVectorManager extends BaseVectorMan {
  velocity: Coordinates;
  radius: number;
  moveSpeed: number;
  constructor(pos: Coordinates, moveSpeed: number, radius: number) {
    super(pos, radius * 2, radius * 2);
    this.position = pos;
    this.velocity = { x: moveSpeed, y: 0 };
    this.radius = radius;
    this.moveSpeed = moveSpeed;
  }

  stopY(yPos: number) {
    this.velocity.y = 0;
    this.setPosY(yPos);
  }
  setVelX(x: number) {
    this.velocity.x = x;
  }
  setVelY(y: number) {
    this.velocity.y = y;
  }

  get velX() {
    return this.velocity.x;
  }
  get velY() {
    return this.velocity.y;
  }
  get isMovingDown() {
    return false;
  }
}
