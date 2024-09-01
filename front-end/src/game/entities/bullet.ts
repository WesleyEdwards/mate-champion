import {createId} from "../loopShared/utils"
import {Textures} from "../../gameAssets/textures"
import {areEntitiesTouching} from "../helpers"
import {distBetween} from "../state/helpers"
import {TimerUp, updatePosAndVel} from "../state/timeHelpers"
import {Coors, CurrAndPrev, Entity} from "./entityTypes"
import {Groog} from "./groog"

export type MBulletState = {
  timers: {timeAlive: TimerUp}
  position: CurrAndPrev
  velocity: CurrAndPrev
  dead: boolean
  initPos: Coors
  dimensions: Coors
  drawDimensions: Coors // rendering is weird with vert
}

export const mBulletConst = {
  dimensions: [24, 24],
  drawDimensions: [42, 24],
  speed: 0.9,
  distUntilDud: 800,
  distFromOppHit: 40
} as const

export class Bullet implements Entity {
  id = createId("bullet")
  typeId = "bullet" as const
  state: MBulletState

  constructor(s: MBulletState) {
    this.state = s
  }

  step: Entity["step"] = (deltaT) => {
    updatePosAndVel(this.state.position, this.state.velocity.curr, deltaT)
    if (
      distBetween(this.state.initPos, this.state.position.curr) >
      mBulletConst.distUntilDud
    ) {
      this.state.dead = true
    }
  }

  render: Entity["render"] = (cxt) => {
    cxt.translate(this.state.dimensions[0] / 2, this.state.dimensions[1] / 2)

    cxt.rotate(
      (() => {
        if (this.state.velocity.curr[0] > 0) return 0
        if (this.state.velocity.curr[0] < 0) return Math.PI
        return (Math.PI / 2) * 3
      })()
    )
    cxt.translate(-this.state.dimensions[0] / 2, -this.state.dimensions[1] / 2)

    const spritesInRow = 4
    const whichSprite =
      Math.round(this.state.timers.timeAlive.val / 10) % spritesInRow

    const imgWidth = 28

    // Rotate to draw
    const w = this.state.drawDimensions[0]
    const h = this.state.drawDimensions[1]

    cxt.drawImage(
      Textures().bullet,
      imgWidth * whichSprite,
      0,
      imgWidth,
      Textures().bullet.height,
      0,
      0,
      w,
      h
    )
  }

  handleInteraction: Entity["handleInteraction"] = (entities) => {
    for (const e of entities) {
      if (e instanceof Groog) {
        if (e.state.render.curr === "die") continue
        if (areEntitiesTouching(this.state, e.state)) {
          e.state.queueActions.push({name: "die"})
          this.state.dead = true
        }
      }
    }
  }
}
