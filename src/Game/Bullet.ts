import { makeImage, MCImage } from "./Drawing/drawingUtils";
import { Coordinates } from "./models";

const bulletWidth = 5;
const bulletHeight = 5;

export class Bullet {
  position: Coordinates;
  velocity: Coordinates;
  image: MCImage;

  constructor(pos: Coordinates, direction?: "left" | "right") {
    this.position = pos;
    this.velocity = direction === "left" ? { x: -10, y: 0 } : { x: 10, y: 0 };
    this.image = makeImage(bulletWidth, bulletHeight, "bullet");
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
}
