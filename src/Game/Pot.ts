import { BaseVectorMan } from "./VectorManager/BaseVectorMan";
import { END_POS } from "./constants";
import { potImage } from "./Drawing/ImageRepos";
import { StaticObject } from "./models";
import { Canvas } from "./helpers/types";

export class Pot implements StaticObject {
  vector: PotVector;
  image: HTMLImageElement = potImage.image;
  canMoveBelow: boolean = false;

  constructor() {
    this.vector = new PotVector(
      { x: END_POS + 750, y: 100 },
      potImage.width,
      potImage.height
    );
  }

  draw(ctx: Canvas) {
    ctx.drawImage(this.image, this.vector.posX, this.vector.posY);
  }

  reset() {
    this.vector.setPosX(END_POS + 750);
  }
}

class PotVector extends BaseVectorMan {}
