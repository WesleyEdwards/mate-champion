import { Textures } from "../../gameAssets/textures";
import { ChampState, ChampAssetDes, champConst } from "../entities/champ";
import { SpriteAssetInfo } from "./helpers";

export const renderPlayer = (p: ChampState, cxt: CanvasRenderingContext2D) => {
  const asset = champAssets[p.render.curr];

  if (!asset) return;

  const w = champConst.render.imageWidth;

  const whichSprite =
    Math.floor(p.timers.sprite.val / asset.cycleTime()) % asset.imgCount;

  if (p.facing.x === "left") {
    cxt.translate(p.dimensions[0], 0);
    cxt.scale(-1, 1);
  }

  const sx = (asset.startX + whichSprite) * w;

  const drawImageWidth = 300; // this allows room for the attacks to be drawn
  const drawImageHeight = drawImageWidth * (105 / 200);

  cxt.drawImage(
    asset.image(),
    sx,
    0,
    w,
    asset.image().height,
    -drawImageWidth / 2 + p.dimensions[0] / 2,
    -(drawImageHeight - p.dimensions[1]),
    drawImageWidth,
    drawImageHeight
  );
};

const champAssets: SpriteAssetInfo<ChampAssetDes> = {
  "hor-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 4,
    startX: 0,
    cycleTime: () => 1000,
  },
  "hor-none-walk": {
    image: () => Textures().champ.walk,
    imgCount: 8,
    startX: 0,
    cycleTime: () => champConst.render.walkCycleTime,
  },
  "hor-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: () => champConst.shootCoolDown / 6,
  },
  "hor-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: () => champConst.shootCoolDown / 6,
  },
  "hor-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: () => champConst.melee.time / 5,
  },
  "hor-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: () => champConst.melee.time / 5,
  },

  "up-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 1,
    startX: 8,
    cycleTime: () => 1000,
  },
  "up-none-walk": {
    image: () => Textures().champ.upLookWalk,
    imgCount: 8,
    startX: 0,
    cycleTime: () => champConst.render.walkCycleTime,
  },
  "up-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: () => champConst.shootCoolDown / 6,
  },
  "up-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: () => champConst.shootCoolDown / 6,
  },
  "up-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: () => champConst.melee.time / 5,
  },
  "up-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: () => champConst.melee.time / 5,
  },
  rising: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 0,
    cycleTime: () => 100,
  },
  falling: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 1,
    cycleTime: () => 100,
  },
};
