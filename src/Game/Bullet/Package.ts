import { BaseVectorMan } from "../VectorManager/BaseVectorMan";
import { GRAVITY } from "../constants";
import { MCImage } from "../Drawing/drawingUtils";
import { packageImage } from "../Drawing/ImageRepos";
import { HasPosition } from "../models";

export type PackageProps = {
  x: number;
  y: number;
};

export class Package implements HasPosition {
  vector: PackageVector;
  image: MCImage = packageImage;

  constructor({ x, y }: PackageProps) {
    this.vector = new PackageVector({ x, y }, 1, packageImage.width);
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
