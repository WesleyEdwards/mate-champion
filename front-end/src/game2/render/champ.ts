import { PlayerDescription } from "../../Game/Player/PlayerSpriteInfo";
import { Textures } from "../../gameAssets/textures";
import {
  PlayerAction,
  PlayerMove,
} from "../../Game/Player/PlayerVectorManager";
import { Champ, ChampAssetDes, champConst } from "../champ";
import { AssetInfo, RenderFunH, SpriteAssetInfo } from "./helpers";

export const renderPlayer: RenderFunH<Champ> = (p) => (cxt) => {
  const asset = champAssets[p.render.curr];

  if (!asset) return;

  const w = champConst.render.imageWidth;

  const whichSprite =
    Math.round(p.timer.sprite.val / asset.cycleTime) % asset.imgCount;

  if (p.facing.x === "left") {
    cxt.scale(-1, 1);
  }

  const sx = champConst.render.imageWidth * whichSprite + asset.startX * w;

  const drawImageWidth = 300; // this allows room for the attacks to be drawn
  const drawImageHeight = drawImageWidth * (105 / 200);

  cxt.drawImage(
    asset.image(),
    sx,
    0,
    w,
    asset.image().height,
    -drawImageWidth / 2,
    -(drawImageHeight - champConst.height / 2),
    drawImageWidth,
    drawImageHeight
  );
  cxt.fillRect(-3, -3, 3, 3);
};

const champAssets: SpriteAssetInfo<ChampAssetDes> = {
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
    cycleTime: champConst.melee.time / 5,
  },
  "none-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: champConst.melee.time / 5,
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
    cycleTime: champConst.melee.time / 5,
  },
  "up-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: champConst.melee.time / 5,
  },
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

export const getChampSpritesInfo = (p: Champ): ChampAssetDes => {
  const directionY = p.facing.y === "down" ? "none" : p.facing.y;
  const action = (): PlayerAction => {
    if (!p.action) return "none";
    if (p.timer.actionTimeRemain.val <= 0) {
      return "none";
    } else {
    }
    return p.action;
  };

  const move: PlayerMove = p.velocity.curr.x === 0 ? "none" : "walk";

  const inAir =
    p.velocity.curr.y > 0 ? "falling" : p.velocity.curr.y < 0 ? "rising" : null;

  const sprite: PlayerDescription = `${directionY}-${action()}-${move}`;
  // console.log(sprite);

  if (inAir && !sprite.includes("melee")) {
    return inAir;
  }

  return sprite;
};
