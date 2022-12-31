import { CharAction, Coordinates, VectorMan } from "../models";

export class OpponentVectorManager implements VectorMan {
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

  setPosY(y: number) {
    this.position.y = y;
  }

  stopY(yPos: number) {
    this.velocity.y = 0;
    this.setPosY(yPos);
  }

  get height() {
    return this.radius * 2;
  }
  get bottomPos() {
    return this.position.y + this.height;
  }
  get rightPos() {
    return this.position.x + this.radius * 2;
  }

  get posCenter() {
    return {
      x: this.position.x + this.radius,
      y: this.position.y + this.radius,
    };
  }
  get isMovingDown() {
    return false;
  }
}
