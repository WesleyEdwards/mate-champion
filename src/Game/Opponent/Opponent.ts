import { GRAVITY, MAX_CANVAS_HEIGHT, opponentConst } from "../constants";
import { DrawManager } from "../Drawing/DrawManager";
import { Character, OppDirections, CharAction } from "../models";
import { randomOutOf } from "../helpers/utils";
import { OpponentVectorManager } from "./OpponentVectorManager";

export type OppProps = {
  x: number;
  moveSpeed: number;
};

export class Opponent implements Character {
  vector: OpponentVectorManager;
  drawManager: DrawManager;

  constructor({ x, moveSpeed }: OppProps) {
    this.vector = new OpponentVectorManager(
      { x, y: 100 },
      moveSpeed,
      opponentConst.radius
    );
    this.drawManager = new DrawManager(
      "opponent",
      opponentConst.radius * 2,
      opponentConst.radius * 2
    );
  }

  update(elapsedTime: number) {
    this.vector.update(elapsedTime);
    this.velocity.y += GRAVITY * elapsedTime;

    if (this.bottomPos > MAX_CANVAS_HEIGHT) {
      this.vector.stopY(MAX_CANVAS_HEIGHT - this.height);
    }

    if (randomOutOf(120)) this.move("Jump");
    if (randomOutOf(120)) this.move("MoveRight");
    if (randomOutOf(120)) this.move("MoveLeft");
  }
  move(action: CharAction) {
    this.vector.move(action);
  }

  draw(cxt: CanvasRenderingContext2D) {
    this.drawManager.draw(cxt, this.position, this.facing);
  }

  setPosY(num: number) {
    return this.vector.stopY(num);
  }

  get bottomPos() {
    return this.position.y + this.height;
  }

  get height() {
    return this.vector.height;
  }

  get posCenter() {
    return this.vector.posCenter;
  }

  get position() {
    return this.vector.position;
  }

  get velocity() {
    return this.vector.velocity;
  }

  get facing(): OppDirections {
    if (this.vector.velocity.x > 0) return "right";
    return "left";
  }

  get moveDown() {
    return false;
  }
}
