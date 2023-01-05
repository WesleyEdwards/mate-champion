import { BaseVectorMan } from "./BaseVectorMan";
import { GRAVITY } from "./constants";
import { MCImage } from "./Drawing/drawingUtils";
import { packageImage } from "./Drawing/ImageRepos";
import { HasPosition } from "./models";

export class Package implements HasPosition {
  vector: PackageVector;
  image: MCImage = packageImage;

  constructor(xPos: number) {
    this.vector = new PackageVector({ x: xPos, y: 100 }, 1, packageImage.width);
  }

  update() {
    this.position.y += this.velocity.y;
    this.velocity.y += GRAVITY;
  }
  draw(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(
      this.image.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height
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

  get moveDown() {
    return false;
  }
}

class PackageVector extends BaseVectorMan {
  velocity: { x: number; y: number } = { x: 0, y: 0 };
  stopY(yPos: number) {
    this.velocity.y = 0;
    this.setPosY(yPos);
  }
}
