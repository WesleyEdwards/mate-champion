import { BaseVectorMan } from "./BaseVectorMan";
import { END_POS } from "./constants";
import { potImage } from "./Drawing/ImageRepos";
import { StaticObject } from "./models";

export class Pot implements StaticObject {
  vector: PotVector;
  color: string = "green";
  image: HTMLImageElement = potImage.image;
  canMoveBelow: boolean = false;

  constructor() {
    this.vector = new PotVector(
      {
        x: END_POS + 750,
        y: 50,
      },
      potImage.width,
      potImage.height
    );
  }
  draw(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(this.image, this.vector.posX, this.vector.posY);
  }
}

class PotVector extends BaseVectorMan {}
