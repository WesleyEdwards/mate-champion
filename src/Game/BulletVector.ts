import { BaseVectorMan } from "./BaseVectorMan";
import { Coordinates } from "./models";

export class BulletVector extends BaseVectorMan {
  velocity: Coordinates;
  constructor(pos: Coordinates, moveSpeed: number, radius: number) {
    super(pos, radius * 2, radius * 2);
    this.velocity = { x: moveSpeed, y: 0 };
  }

  setVelX(x: number) {
    this.velocity.x = x;
  }
  setVelY(y: number) {
    this.velocity.y = y;
  }
  setPosX(x: number) {
    this.position.x = x;
  }
  setPosY(y: number) {
    this.position.y = y;
  }
  get velX() {
    return this.velocity.x;
  }
  get velY() {
    return this.velocity.y;
  }
}
