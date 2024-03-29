import { GRAVITY, MAX_CANVAS_HEIGHT, oppConstants } from "../constants";
import { DrawManager } from "../Drawing/DrawManager";
import { OppImages, oppImages } from "../Drawing/ImageRepos";
import { Character, OppDirections, CharAction } from "../models";
import { randomOutOf } from "../utils";
import { OpponentVectorManager } from "./OpponentVectorManager";

export class Opponent implements Character {
  images: OppImages = oppImages;
  vector: OpponentVectorManager;
  drawManager: DrawManager;

  constructor(
    context: CanvasRenderingContext2D,
    xPos: number,
    moveSpeed: number
  ) {
    this.vector = new OpponentVectorManager(
      { x: xPos, y: 100 },
      moveSpeed,
      oppConstants.radius
    );
    this.drawManager = new DrawManager(
      context,
      "opponent",
      oppConstants.radius * 2,
      oppConstants.radius * 2
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

  draw() {
    this.drawManager.draw(this.position, this.facing);
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
