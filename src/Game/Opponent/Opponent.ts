import { GRAVITY, MAX_CANVAS_HEIGHT, oppConstants } from "../constants";
import { OppImages, oppImages } from "../Drawing/ImageRepos";
import { Character, OppDirections, CharAction } from "../models";
import { randomOutOf } from "../utils";
import { OpponentVectorManager } from "./OpponentVectorManager";

export class Opponent implements Character {
  images: OppImages = oppImages;
  vector: OpponentVectorManager;

  constructor(xPos: number, moveSpeed: number) {
    this.vector = new OpponentVectorManager(
      { x: xPos, y: 100 },
      moveSpeed,
      oppConstants.radius
    );
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y += GRAVITY;

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

  draw(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(
      this.images[this.facing].image,
      this.position.x,
      this.position.y,
      this.images[this.facing].width,
      this.images[this.facing].height
    );
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
