import { MBulletState, mBulletConst } from "../bullet";
import { ChampState, champConst } from "../champ";
import { GroogState, groogConst } from "../groog";
import { RenderFun } from "./helpers";

export const boxBulletRender: RenderFun<MBulletState> = (b) => (cxt) => {
  cxt.rotate(
    (() => {
      if (b.velocity.curr[0] > 0) return 0;
      if (b.velocity.curr[0] < 0) return Math.PI;
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

export const boxGroogRender: RenderFun<GroogState> = (g) => (cxt) => {
  cxt.fillRect(-3, -3, 3, 3);
  cxt.strokeStyle = "red";

  cxt.strokeRect(
    -groogConst.dimensions[0] / 2,
    -groogConst.dimensions[1] / 2,
    groogConst.dimensions[0],
    groogConst.dimensions[1]
  );
};

export const boxChampRender: RenderFun<ChampState> = (g) => (cxt) => {
  cxt.fillRect(-3, -3, 3, 3);
  cxt.strokeStyle = "red";

  cxt.strokeRect(
    -champConst.widthHeight.x / 2,
    -champConst.widthHeight.y / 2,
    champConst.widthHeight.x,
    champConst.widthHeight.y
  );
};
