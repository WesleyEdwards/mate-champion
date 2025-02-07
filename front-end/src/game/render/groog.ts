import {Textures} from "../../gameAssets/textures"
import {Groog, GroogAssetDes, groogConst, GroogState} from "../entities/groog"
import {SpriteAssetInfo} from "./helpers"

export const renderGroog = (g: Groog, cxt: CanvasRenderingContext2D) => {
  const asset = grogSpritesInfo[g.state.render.curr]

  if (!asset) return

  const w = groogConst.render.imageWidth

  const whichSprite =
    Math.floor(g.state.timers.sprite.val / asset.cycleTime()) % asset.imgCount

  if (g.velocity[0] < 0 || (g.velocity[0] === 0 && !g.info.facingRight)) {
    cxt.translate(g.width, 0)
    cxt.scale(-1, 1)
  }

  const sx = groogConst.render.imageWidth * whichSprite + asset.startX * w

  const drawImageWidth = 200 // this allows room for the attacks to be drawn
  const drawImageHeight = drawImageWidth * (105 / 200)

  cxt.drawImage(
    asset.image(),
    sx,
    0,
    w,
    asset.image().height,
    -drawImageWidth / 2 + g.width / 2,
    -(drawImageHeight - g.height),
    drawImageWidth,
    drawImageHeight
  )
}

const grogSpritesInfo: SpriteAssetInfo<GroogAssetDes> = {
  walk: {
    image: () => Textures().grog.walking,
    imgCount: 6,
    startX: 0,
    cycleTime: () => 120
  },
  die: {
    image: () => Textures().grog.death,
    imgCount: 5,
    startX: 0,
    cycleTime: () => groogConst.dieTimer / 5
  },
  rising: {
    image: () => Textures().grog.jumpAndFall,
    imgCount: 1,
    startX: 0,
    cycleTime: () => 100
  },
  falling: {
    image: () => Textures().grog.jumpAndFall,
    imgCount: 1,
    startX: 1,
    cycleTime: () => 100
  }
}
