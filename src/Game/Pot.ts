import { END_POS } from "./constants";
import { potImage } from "./Drawing/ImageRepos";
import { Coordinates } from "./models";

export class Pot {
  position: Coordinates;
  width: number;
  height: number;
  color: string;
  image: HTMLImageElement;

  constructor() {
    this.position = {
      x: END_POS + 750,
      y: 50,
    };
    this.width = potImage.width;
    this.height = potImage.height;
    this.color = "green";
    this.image = potImage.image;
  }
  draw(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(this.image, this.position.x, this.position.y);
  }
}
