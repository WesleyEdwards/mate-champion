import { Coordinates, VectorMan } from "../models";

export class ObjVectorManager implements VectorMan {
  position: Coordinates;
  width: number;
  height: number;
  constructor(pos: Coordinates, width: number, height: number) {
    this.position = pos;
    this.width = width;
    this.height = height;
  }

  setPosX(x: number) {
    this.position.x = x;
  }
  setPosY(y: number) {
    this.position.y = y;
  }

  get posX() {
    return this.position.x;
  }
  get posY() {
    return this.position.y;
  }
  get bottomPos() {
    return this.position.y + this.height;
  }
  get rightPos() {
    return this.position.x + this.width;
  }
  get isMovingDown() {
    return false;
  }
  get centerX() {
    return this.position.x + this.width / 2;
  }
  get centerY() {
    return this.position.y + this.height / 2;
  }
  get posCenter() {
    return {
      x: this.centerX,
      y: this.centerY,
    };
  }
}
