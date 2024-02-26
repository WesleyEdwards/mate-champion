import { BaseVectorMan } from "./VectorManager/BaseVectorMan";
import { levelConst } from "./constants";
import { potImage } from "./Drawing/ImageRepos";
import { StaticObject } from "./models";
import { DrawObjProps } from "./helpers/types";

export class Pot implements StaticObject {
  color: string = "black";
  vector: PotVector;
  image: HTMLImageElement = potImage.image;
  isFloor: boolean = false;

  constructor() {
    this.vector = new PotVector(
      { x: 5000, y: 100 },
      potImage.width,
      potImage.height
    );
  }

  draw({ cxt, camOffset }: DrawObjProps) {
    cxt.drawImage(
      this.image,
      this.vector.posX - camOffset.x,
      this.vector.posY + camOffset.y
    );
  }

  reset(endPosition: number) {
    this.vector.setPosX(endPosition);
  }
}

class PotVector extends BaseVectorMan {}
