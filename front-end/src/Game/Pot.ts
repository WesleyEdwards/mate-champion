import { BaseVectorMan } from "./VectorManager/BaseVectorMan";
import { END_POS } from "./constants";
import { potImage } from "./Drawing/ImageRepos";
import { StaticObject } from "./models";
import { Canvas, DrawObjProps } from "./helpers/types";

export class Pot implements StaticObject {
  color: string = "black";
  vector: PotVector;
  image: HTMLImageElement = potImage.image;
  isFloor: boolean = false;

  constructor() {
    this.vector = new PotVector(
      { x: END_POS + 750, y: 100 },
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

  reset() {
    this.vector.setPosX(END_POS + 750);
  }
}

class PotVector extends BaseVectorMan {}
