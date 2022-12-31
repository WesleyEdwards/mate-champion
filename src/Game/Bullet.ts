import { makeImage, MCImage } from "./Drawing/drawingUtils";
import { Coordinates, HasPosition, VagueFacing } from "./models";

const bulletRadius = 15;

function getDirection(dir: VagueFacing): Coordinates {
  if (dir === "left") return { x: -10, y: 0 };
  if (dir === "right") return { x: 10, y: 0 };
  return { x: 0, y: -10 };
}

function calcImage(dir: VagueFacing): MCImage {
  const widthHeight = bulletRadius * 2;
  if (dir === "left" || dir === "right") {
    return makeImage(widthHeight, widthHeight, "bullet-hor");
  }
  return makeImage(widthHeight, widthHeight, "bullet-vert");
}

export class Bullet implements HasPosition {
  position: Coordinates;
  velocity: Coordinates;
  bulletImage: MCImage;
  radius: number;

  constructor(pos: Coordinates, direction: VagueFacing) {
    this.position = pos;
    this.velocity = getDirection(direction);
    this.bulletImage = calcImage(direction);
    this.radius = bulletRadius;
  }

  draw(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(
      this.bulletImage.image,
      this.position.x,
      this.position.y,
      this.bulletImage.width,
      this.bulletImage.height
    );
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  get posCenter() {
    return {
      x: this.position.x + bulletRadius,
      y: this.position.y + bulletRadius,
    };
  }
}
