import {
  ChampState,
  ChampAssetDes,
  ChampDescription,
  Champ
} from "../../entities/champ"

export const updateChampSpriteInfo = (p: Champ) => {
  const currRender = getChampSpritesInfo(p)

  if (currRender !== p.state.render.prev) {
    p.state.timers.sprite.val = 0
  }
  p.state.render.prev = p.state.render.curr
  p.state.render.curr = currRender
}

const getChampSpritesInfo = (p: Champ): ChampAssetDes => {
  const directionY = p.state.facing.y === "down" ? "hor" : p.state.facing.y
  const action = (): PlayerAction => {
    if (!p.state.action) return "none"
    if (p.state.timers.actionTimeRemain.val <= 0) {
      return "none"
    } else {
    }
    return p.state.action
  }

  const move: PlayerMove = p.velocity[0] === 0 ? "none" : "walk"

  const inAir =
    p.velocity[1] > 0 ? "falling" : p.velocity[1] < 0 ? "rising" : null

  const sprite: ChampDescription = `${directionY}-${action()}-${move}`

  if (inAir && !sprite.includes("melee")) {
    return inAir
  }

  return sprite
}

export type PlayerAction = "shoot" | "melee" | "none"
export type PlayerMove = "walk" | "jump" | "none"
