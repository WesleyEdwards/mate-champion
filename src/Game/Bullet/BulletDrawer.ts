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
      if (b.imageType === "bulletHor")
        this.drawHorBullet(b.position.x, b.position.y);
      if (b.imageType === "bulletVert")
        this.drawVertBullet(b.position.x, b.position.y);
    });
  }

  drawHorBullet(xPos: number, yPos: number) {
    this.canvas.drawImage(
      this.imageHor.image,
      xPos - BULLET_RADIUS,
      yPos - BULLET_RADIUS,
      this.imageHor.width,
      this.imageHor.height
    );
  }
  drawVertBullet(xPos: number, yPos: number) {
    this.canvas.drawImage(
      this.imageVert.image,
      xPos - BULLET_RADIUS,
      yPos - BULLET_RADIUS,
      this.imageVert.width,
      this.imageVert.height
    );
  }
}
