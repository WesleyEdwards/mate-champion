import { BaseVectorMan } from "../VectorManager/BaseVectorMan";
import { Coordinates } from "../models";
import { BULLET_RADIUS, BULLET_SPEED } from "../constants";

export class BulletVector extends BaseVectorMan {
  velocity: Coordinates;
  constructor(pos: Coordinates) {
    super(pos, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
    this.velocity = { x: BULLET_SPEED, y: 0 };
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
