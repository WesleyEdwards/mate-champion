import { Textures } from "../../gameAssets/textures";
import { MBullet, mBulletConst } from "../bullet";
import { RenderFunH } from "./helpers";

export const renderBullet: RenderFunH<MBullet> = (b) => (cxt) => {
  cxt.rotate(
    (() => {
      if (b.velocity.x > 0) return 0;
      if (b.velocity.x < 0) return Math.PI;
      return (Math.PI / 2) * 3;
    })()
  );

  const spritesInRow = 4;
  const whichSprite = Math.round(b.timer.timeAlive.val / 10) % spritesInRow;

  const imgWidth = 28;

  const w = mBulletConst.widthHeight.y;
  const h = mBulletConst.widthHeight.x;

  cxt.drawImage(
    Textures().bullet,
    imgWidth * whichSprite,
    0,
    imgWidth,
    h,
    -0.5 * w,
    -0.5 * h,
    w,
    h
  );

  cxt.strokeStyle = "red";
  cxt.lineWidth = 2;
  cxt.strokeRect(-0.5 * w, -0.5 * h, w, h);
  cxt.beginPath();
  cxt.arc(0, 0, 1, 0, 2 * Math.PI);
  cxt.stroke();
};
