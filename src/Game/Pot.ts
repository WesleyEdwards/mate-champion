import { BaseVectorMan } from "./VectorManager/BaseVectorMan";
import { END_POS } from "./constants";
import { potImage } from "./Drawing/ImageRepos";
import { StaticObject } from "./models";

export class Pot implements StaticObject {
  vector: PotVector;
  image: HTMLImageElement = potImage.image;
  canMoveBelow: boolean = false;
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.vector = new PotVector(
      { x: END_POS + 750, y: 50 },
      potImage.width,
      potImage.height
    );
  }

  draw() {
    this.context.drawImage(this.image, this.vector.posX, this.vector.posY);
  }

  reset() {
    this.vector.setPosX(END_POS + 750);
  }
}

class PotVector extends BaseVectorMan {}
