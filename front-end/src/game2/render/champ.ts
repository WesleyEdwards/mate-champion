import { PlayerDescription } from "../../Game/Player/PlayerSpriteInfo";
import { Textures } from "../../gameAssets/textures";
import { Champ, champConst } from "../champ";
import { AssetInfo, RenderFunH, SpriteAssetInfo } from "./helpers";

export const renderPlayer: RenderFunH<Champ> = (p) => (cxt) => {
  const assetToDraw = champSpritesInfo["none-none-none"];
  if (!assetToDraw) return;

  const w = champConst.render.imageWidth;

  const whichSprite =
    Math.round(p.timer.spriteTimer / assetToDraw.cycleTime) %
    assetToDraw.imgCount;

  const sx =
    champConst.render.imageWidth * whichSprite + assetToDraw.startX * w;

  const drawImageWidth = 300; // this allows room for the attacks to be drawn
  const drawImageHeight = drawImageWidth * (105 / 200);
  const sWidth = drawImageWidth;

  cxt.drawImage(
    assetToDraw.image(),
    sx,
    0,
    w,
    assetToDraw.image().height,
    -drawImageWidth / 2,
    -(drawImageHeight - champConst.height / 2),
    drawImageWidth,
    drawImageHeight
  );
  cxt.fillRect(-3, -3, 3, 3);
};

export const champSpritesInfo: SpriteAssetInfo<PlayerDescription> = {
  "none-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 4,
    startX: 0,
    cycleTime: 1000,
  },
  "none-none-walk": {
    image: () => Textures().champ.walk,
    imgCount: 8,
    startX: 0,
    cycleTime: champConst.render.walkCycleTime,
  },
  "none-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: champConst.shootCoolDown / 6,
  },
  "none-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: champConst.shootCoolDown / 6,
  },
  "none-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: champConst.shankTime / 5,
  },
  "none-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: champConst.shankTime / 5,
  },

  "up-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 1,
    startX: 8,
    cycleTime: 1000,
  },
  "up-none-walk": {
    image: () => Textures().champ.upLookWalk,
    imgCount: 8,
    startX: 0,
    cycleTime: champConst.render.walkCycleTime,
  },
  "up-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: champConst.shootCoolDown / 6,
  },
  "up-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: champConst.shootCoolDown / 6,
  },
  "up-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: champConst.shankTime / 5,
  },
  "up-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: champConst.shankTime / 5,
  },
};

export const champSpriteJumping: SpriteAssetInfo<"rising" | "falling"> = {
  rising: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 0,
    cycleTime: 100,
  },
  falling: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 1,
    cycleTime: 100,
  },
};
