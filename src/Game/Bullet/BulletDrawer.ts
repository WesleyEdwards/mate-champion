import { Bullet } from "./Bullet";
import { makeImage, MCImage } from "../Drawing/drawingUtils";
import { BULLET_RADIUS } from "../constants";

export type bulletImageType = "bulletHor" | "bulletVert";

export class BulletDrawer {
  canvas: CanvasRenderingContext2D;
  imageHor: MCImage;
  imageVert: MCImage;
  constructor(context: CanvasRenderingContext2D) {
    const widthHeight = BULLET_RADIUS * 2;
    this.canvas = context;
    this.imageHor = makeImage(widthHeight, widthHeight, "bulletHor");
    this.imageVert = makeImage(widthHeight, widthHeight, "bulletVert");
  }

  draw(bullets: Bullet[]) {
    bullets.forEach((b) => {
      const image =
        b.imageType === "bulletHor" ? this.imageHor : this.imageVert;

      this.canvas.drawImage(
        image.image,
        b.position.x - BULLET_RADIUS,
        b.position.y - BULLET_RADIUS,
        image.width,
        image.height
      );
    });
  }
}
