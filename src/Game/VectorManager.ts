import { Coordinates, VectorMan } from "./models";

export class VectorManager implements VectorMan {
  position: Coordinates;
  velocity: Coordinates;
  radius: number;
  moveSpeed: number;
  constructor(pos: Coordinates, moveSpeed: number, radius: number) {
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
  get velX() {
    return this.velocity.x;
  }
  get velY() {
    return this.velocity.y;
  }
  get bottomPos() {
    return this.position.y + this.height;
  }
  get rightPos() {
    return this.position.x + this.radius * 2;
  }
  get width() {
    return this.radius * 2;
  }
  get height() {
    return this.radius * 2;
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
