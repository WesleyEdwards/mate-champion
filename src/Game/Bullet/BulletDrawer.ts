import { Bullet } from "./Bullet";
import { makeImage, MCImage } from "../Drawing/drawingUtils";
import { bulletConst } from "../constants";
import { Canvas } from "../helpers/types";

export type bulletImageType = "bulletHor" | "bulletVert";

export class BulletDrawer {
  imageHor: MCImage;
  imageVert: MCImage;
  constructor() {
    const widthHeight = bulletConst.radius * 2;
    this.imageHor = makeImage(widthHeight, widthHeight, "bulletHor");
    this.imageVert = makeImage(widthHeight, widthHeight, "bulletVert");
  }

  draw(ctx: Canvas, bullets: Bullet[]) {
    bullets.forEach((b) => {
      if (b.imageType === "bulletHor")
        this.drawHorBullet(ctx, b.position.x, b.position.y);
      if (b.imageType === "bulletVert")
        this.drawVertBullet(ctx, b.position.x, b.position.y);
    });
  }

  drawHorBullet(ctx: Canvas, xPos: number, yPos: number) {
    ctx.drawImage(
      this.imageHor.image,
      xPos - bulletConst.radius,
      yPos - bulletConst.radius,
      this.imageHor.width,
      this.imageHor.height
    );
  }
  drawVertBullet(ctx: Canvas, xPos: number, yPos: number) {
    ctx.drawImage(
      this.imageVert.image,
      xPos - bulletConst.radius,
      yPos - bulletConst.radius,
      this.imageVert.width,
      this.imageVert.height
    );
  }
}
