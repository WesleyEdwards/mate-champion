import { Bullet } from "./Bullet";
import { bulletConst } from "../constants";
import { DrawObjProps } from "../helpers/types";
import { devSettings } from "../devSettings";

import bulletSprite from "../../assets/mate_bullet.png";

// image,
// where on spriteSheet to start X,
// where on spriteSheet to start Y,
// total Width of sprite sheet
// total height of sprite sheet,
// x coordinate on canvas
// y coordinate on canvas
// width on canvas to show
// height on canvas to show

const spritesInRow = 4;

export class BulletDrawer {
  image: HTMLImageElement;
  imageWidth: number;
  constructor() {
    this.image = new Image();
    this.image.src = bulletSprite;
    this.imageWidth = 28;
  }

  draw({ cxt, camOffset }: DrawObjProps, bullets: Bullet[]) {
    bullets.forEach((b) => {
      const whichSprite = Math.round((b?.timeAlive ?? 0) / 10) % spritesInRow;

      cxt.save();
      cxt.translate(b.position.x - camOffset.x, b.position.y + camOffset.y);

      cxt.rotate(
        (() => {
          if (b.vector.velX > 0) return 0;
          if (b.vector.velX < 0) return Math.PI;
          return (Math.PI / 2) * 3;
        })()
      );

      cxt.drawImage(
        this.image,
        this.imageWidth * whichSprite,
        0,
        this.imageWidth,
        this.image.height,
        -0.5 * bulletConst.width,
        -0.5 * bulletConst.height,
        bulletConst.width,
        bulletConst.height
      );

      if (devSettings.redOutline) {
        cxt.strokeStyle = "red";
        cxt.lineWidth = 2;
        cxt.strokeRect(
          -0.5 * bulletConst.width,
          -0.5 * bulletConst.height,
          bulletConst.width,
          bulletConst.height
        );
        cxt.beginPath();
        cxt.arc(0, 0, 1, 0, 2 * Math.PI);
        cxt.stroke();
      }

      cxt.restore();
    });
  }
}
