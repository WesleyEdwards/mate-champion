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

  const w = mBulletConst.widthHeight.x;
  const h = mBulletConst.widthHeight.y;

  cxt.drawImage(
    Textures().bullet,
    imgWidth * whichSprite,
    0,
    imgWidth,
    Textures().bullet.height,
    -w / 2,
    -h / 2,
    w,
    h
  );
};
