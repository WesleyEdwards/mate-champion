import { MAX_CANVAS_HEIGHT, GRAVITY, oppConstants } from "../constants";
import { OppImages, oppImages } from "../Drawing/ImageRepos";
import { Character, Coordinates, OppDirections, CharAction } from "../models";
import { randomOutOf } from "../utils";

export class Opponent implements Character {
  position: Coordinates;
  velocity: Coordinates;
  radius: number;
  images: OppImages;

  constructor(xPos: number, moveSpeed: number) {
    this.position = { x: xPos, y: 100 };
    this.velocity = { x: moveSpeed, y: 0 };
    this.radius = oppConstants.radius;
    this.images = oppImages;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (randomOutOf(150)) {
      this.velocity.y = -15;
    }

    if (randomOutOf(150)) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.bottomPos > MAX_CANVAS_HEIGHT) this.move("StopY");
    else this.velocity.y += GRAVITY;
  }

  move(action: CharAction) {
    if (action === "StopY") {
      this.velocity.y = 0;
      this.position.y = MAX_CANVAS_HEIGHT - this.height;
    }
    if (action === "Jump") {
      this.velocity.y = -15;
    }
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

  get bottomPos() {
    return this.position.y + this.height;
  }
  
  get rightPos() {
    return this.position.x + this.radius * 2;
  }

  get height() {
    return this.images[this.facing].height;
  }

  get posCenter() {
    return {
      x: this.position.x + oppConstants.radius,
      y: this.position.y + oppConstants.radius,
    };
  }

  get facing(): OppDirections {
    if (this.velocity.x > 0) return "right";
    return "left";
  }
}
