import {Textures} from "../../gameAssets/textures"
import {areEntitiesTouching} from "../helpers"
import {distBetween} from "../state/helpers"
import {emptyTime, TimerUp, updatePosAndVel} from "../state/timeHelpers"
import {Coors, CurrAndPrev} from "./entityTypes"
import {Groog} from "./groog"
import {BaseEntity, Entity} from "./Entity"
import {WithVelocity} from "./VelocityMixin"

export const mBulletConst = {
  dimensions: [24, 24],
  drawDimensions: [42, 24],
  speed: 0.9,
  distUntilDud: 800,
  distFromOppHit: 40
} as const

class BulletBase extends WithVelocity(BaseEntity) {
  initPos: Coors

  constructor(position: Coors, velocity: Coors) {
    super({
      typeId: "bullet",
      position: position,
      dimensions: [mBulletConst.dimensions[0], mBulletConst.dimensions[1]]
    })
    this.velocity = [...velocity]
    this.initPos = [...position]
  }
}

export class Bullet extends BulletBase {
  timers: {timeAlive: TimerUp} = {timeAlive: emptyTime("up")}

  step: Entity["step"] = (deltaT) => {
    updatePosAndVel(this.position, this.velocity, deltaT)
    if (
      distBetween(this.initPos, this.position.curr) > mBulletConst.distUntilDud
    ) {
      this.dead = true
    }
  }

  render: Entity["render"] = (cxt) => {
    cxt.translate(this.width / 2, this.height / 2)

    cxt.rotate(
      (() => {
        if (this.velocity[0] > 0) return 0
        if (this.velocity[0] < 0) return Math.PI
        return (Math.PI / 2) * 3
      })()
    )
    cxt.translate(-this.width / 2, -this.height / 2)

    const spritesInRow = 4
    const whichSprite =
      Math.round(this.timers.timeAlive.val / 10) % spritesInRow

    const imgWidth = 28

    // Rotate to draw
    const w = mBulletConst.drawDimensions[0]
    const h = mBulletConst.drawDimensions[1]

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
        if (areEntitiesTouching(this, e)) {
          e.state.queueActions.push({name: "die"})
          this.dead = true
        }
      }
    }
  }
}
