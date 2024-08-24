import { ChampState, ChampAssetDes, ChampDescription } from "../../entities/champ";

export const updateChampSpriteInfo = (p: ChampState) => {
  const currRender = getChampSpritesInfo(p);

  if (currRender !== p.render.prev) {
    p.timers.sprite.val = 0;
  }
  p.render.prev = p.render.curr;
  p.render.curr = currRender;
};

const getChampSpritesInfo = (p: ChampState): ChampAssetDes => {
  const directionY = p.facing.y === "down" ? "hor" : p.facing.y;
  const action = (): PlayerAction => {
    if (!p.action) return "none";
    if (p.timers.actionTimeRemain.val <= 0) {
      return "none";
    } else {
    }
    return p.action;
  };

  const move: PlayerMove = p.velocity[0] === 0 ? "none" : "walk";

  const inAir =
    p.velocity[1] > 0 ? "falling" : p.velocity[1] < 0 ? "rising" : null;

  const sprite: ChampDescription = `${directionY}-${action()}-${move}`;

  if (inAir && !sprite.includes("melee")) {
    return inAir;
  }

  return sprite;
};

export type PlayerAction = "shoot" | "melee" | "none";
export type PlayerMove = "walk" | "jump" | "none";
