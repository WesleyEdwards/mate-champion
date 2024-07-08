import { Textures } from "../../gameAssets/textures";
import { Groog, GroogAssetDes, groogConst } from "../groog";
import { RenderFunH, SpriteAssetInfo } from "./helpers";

export const renderGroog: RenderFunH<Groog> = (g) => (cxt) => {
  const asset = grogSpritesInfo[g.render.curr];

  if (!asset) return;

  const w = groogConst.render.width;

  const whichSprite =
    Math.round(g.timer.sprite.val / asset.cycleTime) % asset.imgCount;

  if (g.facing === "left") {
    cxt.scale(-1, 1);
  }

  const sx = groogConst.render.width * whichSprite + asset.startX * w;

  const drawImageWidth = 300; // this allows room for the attacks to be drawn
  const drawImageHeight = drawImageWidth * (105 / 200);

  cxt.drawImage(
    asset.image(),
    sx,
    0,
    w,
    asset.image().height,
    -drawImageWidth / 2,
    -(drawImageHeight - groogConst.render.height / 2),
    drawImageWidth,
    drawImageHeight
  );
  cxt.fillRect(-3, -3, 3, 3);
};

const grogSpritesInfo: SpriteAssetInfo<GroogAssetDes> = {
  walk: {
    image: () => Textures().grog.walking,
    imgCount: 6,
    startX: 0,
    cycleTime: 120,
  },
  die: {
    image: () => Textures().grog.death,
    imgCount: 5,
    startX: 0,
    cycleTime: 105,
  },
  rising: {
    image: () => Textures().grog.jumpAndFall,
    imgCount: 1,
    startX: 0,
    cycleTime: 100,
  },
  falling: {
    image: () => Textures().grog.jumpAndFall,
    imgCount: 1,
    startX: 1,
    cycleTime: 100,
  },
};
