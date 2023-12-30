import { BaseVectorMan } from "../VectorManager/BaseVectorMan";
import { bulletConst } from "../constants";
import { Coordinates } from "../models";

export class BulletVector extends BaseVectorMan {
  velocity: Coordinates;
  constructor(pos: Coordinates, vel: Coordinates) {
    super(pos, bulletConst.width, bulletConst.height);
    this.velocity = vel;
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
