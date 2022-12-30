import { makeImage, MCImage } from "./Drawing/drawingUtils";
import { Coordinates } from "./models";

const bulletWidth = 25;
const bulletHeight = 25;
type BulletDirection = "left" | "right" | "up";

function getDirection(dir: BulletDirection): Coordinates {
  if (dir === "left") return { x: -10, y: 0 };
  if (dir === "right") return { x: 10, y: 0 };
  return { x: 0, y: -10 };
}

export class Bullet {
  position: Coordinates;
  velocity: Coordinates;
  images: { horizontal: MCImage; vertical: MCImage };

  constructor(pos: Coordinates, direction: BulletDirection) {
    this.position = pos;
    this.velocity = getDirection(direction);
    this.images = {
      horizontal: makeImage(bulletWidth, bulletHeight, "bullet-hor"),
      vertical: makeImage(bulletWidth, bulletHeight, "bullet-vert"),
    };
  }

  draw(canvas: CanvasRenderingContext2D) {
    if (this.velocity.x === 0) {
      canvas.drawImage(
        this.images.vertical.image,
        this.position.x,
        this.position.y,
        this.images.vertical.width,
        this.images.vertical.height
      );
      return;
    }
    canvas.drawImage(
      this.images.horizontal.image,
      this.position.x,
      this.position.y,
      this.images.horizontal.width,
      this.images.horizontal.height
    );
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
