import { BaseVectorMan } from "../VectorManager/BaseVectorMan";
import { GRAVITY } from "../constants";
import { MCImage } from "../Drawing/drawingUtils";
import { packageImage } from "../Drawing/ImageRepos";
import { HasPosition } from "../models";

export class Package implements HasPosition {
  vector: PackageVector;
  image: MCImage = packageImage;
  platform: number;

  constructor(xPos: number, platsUnder: number[]) {
    this.vector = new PackageVector({ x: xPos, y: 100 }, 1, packageImage.width);

    this.platform = Math.min(...platsUnder);
  }

  update(elapsedTime: number) {
    if (this.bottomPos >= this.platform) return;

    this.position.y += this.velocity.y * elapsedTime;
    this.velocity.y += GRAVITY * elapsedTime;
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
}

class PackageVector extends BaseVectorMan {
  velocity: { x: number; y: number } = { x: 0, y: 0 };
  stopY(yPos: number) {
    this.velocity.y = 0;
    this.setPosY(yPos);
  }
}
