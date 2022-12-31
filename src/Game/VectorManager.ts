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
    this.position.y = yPos;
  }
  setVelocityX(x: number) {
    this.velocity.x = x;
  }
  setVelocityY(y: number) {
    this.velocity.y = y;
  }
  setPositionX(x: number) {
    this.position.x = x;
  }

  get positionX() {
    return this.position.x;
  }
  get positionY() {
    return this.position.y;
  }
  get velocityX() {
    return this.velocity.x;
  }
  get velocityY() {
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
