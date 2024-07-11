import { MBullet, mBulletConst } from "../bullet";
import { GameState1 } from "../State1";
import {
  RenderableItems,
  RenderFunH,
  renderBuilder,
  renderItemsOnCanvas,
} from "./helpers";

export const renderBoxes = (gs: GameState1, cxt: CanvasRenderingContext2D) => {
  const builders: RenderableItems = [
    renderBuilder({ fun: renderBulletBox, getter: (gs) => gs.bullets }),
  ];

  renderItemsOnCanvas(builders, cxt, gs);
};

const renderBulletBox: RenderFunH<MBullet> = (b) => (cxt) => {
  cxt.rotate(
    (() => {
      if (b.velocity.x > 0) return 0;
      if (b.velocity.x < 0) return Math.PI;
      return (Math.PI / 2) * 3;
    })()
  );

  const w = mBulletConst.widthHeight.x;
  const h = mBulletConst.widthHeight.y;

  cxt.strokeStyle = "red";
  cxt.lineWidth = 2;
  cxt.strokeRect(-0.5 * w, -0.5 * h, w, h);
  cxt.beginPath();
  cxt.arc(0, 0, 1, 0, 2 * Math.PI);
  cxt.stroke();
};
