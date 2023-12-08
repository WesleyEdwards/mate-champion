import { Bullet } from "./Bullet";
import { makeImage, MCImage } from "../Drawing/drawingUtils";
import { bulletConst } from "../constants";
import { Canvas } from "../helpers/types";
import { devSettings } from "../devSettings";

export type bulletImageType = "bulletHor" | "bulletVert";

export class BulletDrawer {
  imageHor: MCImage;
  imageVert: MCImage;
  constructor() {
    const widthHeight = bulletConst.radius * 2;
    this.imageHor = makeImage(widthHeight, widthHeight, "bulletHor");
    this.imageVert = makeImage(widthHeight, widthHeight, "bulletVert");
  }

  draw(cxt: Canvas, bullets: Bullet[]) {
    const { radius } = bulletConst;
    bullets.forEach((b) => {
      cxt.drawImage(
        this.imageHor.image,
        b.position.x - radius,
        b.position.y - radius,
        radius * 2,
        radius * 2
      );

      if (devSettings.redOutline) {
        cxt.strokeStyle = "red";
        cxt.lineWidth = 2;
        cxt.strokeRect(
          b.position.x - radius,
          b.position.y - radius,
          radius * 2,
          radius * 2
        );
      }
    });
  }
}
