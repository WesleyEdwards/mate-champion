import {Textures} from "../../gameAssets/textures"
import {ChampAssetDes, champConst, ChampBase} from "../entities/champ/champ"
import {Entity, EntityConstructor} from "../entities/Entity"
import {Constructor} from "../entities/entityTypes"
import {SpriteAssetInfo} from "./helpers"

export function RenderChamp<TBase extends Constructor<ChampBase>>(Base: TBase) {
  return class extends Base {
    render: Entity["render"] = (cxt) => {
      const asset = champAssets[this.state.render.curr]

      if (!asset) return

      const w = champConst.render.imageWidth

      const whichSprite =
        Math.floor(this.state.timers.sprite.val / asset.cycleTime()) %
        asset.imgCount

      if (this.state.facing.x === "left") {
        cxt.translate(this.width, 0)
        cxt.scale(-1, 1)
      }

      const sx = (asset.startX + whichSprite) * w

      const drawImageWidth = 300 // this allows room for the attacks to be drawn
      const drawImageHeight = drawImageWidth * (105 / 200)

      cxt.drawImage(
        asset.image(),
        sx,
        0,
        w,
        asset.image().height,
        -drawImageWidth / 2 + this.width / 2,
        -(drawImageHeight - this.height),
        drawImageWidth,
        drawImageHeight
      )
    }
  }
}

const champAssets: SpriteAssetInfo<ChampAssetDes> = {
  "hor-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 4,
    startX: 0,
    cycleTime: () => 1000
  },
  "hor-none-walk": {
    image: () => Textures().champ.walk,
    imgCount: 8,
    startX: 0,
    cycleTime: () => champConst.render.walkCycleTime
  },
  "hor-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: () => champConst.shootCoolDown / 6
  },
  "hor-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: () => champConst.shootCoolDown / 6
  },
  "hor-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: () => champConst.melee.time / 5
  },
  "hor-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: () => champConst.melee.time / 5
  },

  "up-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 1,
    startX: 8,
    cycleTime: () => 1000
  },
  "up-none-walk": {
    image: () => Textures().champ.upLookWalk,
    imgCount: 8,
    startX: 0,
    cycleTime: () => champConst.render.walkCycleTime
  },
  "up-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: () => champConst.shootCoolDown / 6
  },
  "up-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: () => champConst.shootCoolDown / 6
  },
  "up-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: () => champConst.melee.time / 5
  },
  "up-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: () => champConst.melee.time / 5
  },
  rising: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 0,
    cycleTime: () => 100
  },
  falling: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 1,
    cycleTime: () => 100
  }
}
