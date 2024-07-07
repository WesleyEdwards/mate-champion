import { PlayerDescription } from "../../../Game/Player/PlayerSpriteInfo";
import {
  PlayerAction,
  PlayerMove,
} from "../../../Game/Player/PlayerVectorManager";
import { Champ, ChampAssetDes, ChampDescription } from "../../champ";

export const updateChampSpriteInfo = (p: Champ) => {
  const currRender = getChampSpritesInfo(p);

  if (currRender !== p.render.prev) {
    p.timer.sprite.val = 0;
  }
  p.render.prev = p.render.curr;
  p.render.curr = currRender;
};

const getChampSpritesInfo = (p: Champ): ChampAssetDes => {
  const directionY = p.facing.y === "down" ? "hor" : p.facing.y;
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

  const sprite: ChampDescription = `${directionY}-${action()}-${move}`;

  if (inAir && !sprite.includes("melee")) {
    return inAir;
  }

  return sprite;
};
