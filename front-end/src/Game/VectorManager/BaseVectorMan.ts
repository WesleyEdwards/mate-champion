import { Coordinates, VectorMan } from "../models";

export class BaseVectorMan implements VectorMan {
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
  get isMovingDown() {
    return false;
  }

  relativePos(xOffset: number) {
    return {
      x: this.position.x - xOffset,
      y: this.position.y,
    };
  }
}
