import { Coordinates, VectorMan } from "../models";

export type ObjVectorManagerProps = {
  pos: Coordinates;
  width: number;
  height: number;
};

export class ObjVectorManager implements VectorMan {
  position: Coordinates;
  width: number;
  height: number;
  constructor({ pos, width, height }: ObjVectorManagerProps) {
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
  get centerX() {
    return this.position.x + this.width / 2;
  }
  get centerY() {
    return this.position.y + this.height / 2;
  }
  relativePos(xOffset: number) {
    return {
      x: this.position.x - xOffset,
      y: this.position.y,
    };
  }
}
