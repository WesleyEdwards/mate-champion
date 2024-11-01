import {Champ} from "../entities/champ"
import {updateKeys} from "./keys"
import {updateCameraWithPlayer} from "./camera"
import {Coors, GameStateProps} from "../entities/entityTypes"
import {toCurrAndPrev} from "../helpers"
import {emptyTime} from "./timeHelpers"
import {Bullet, mBulletConst} from "../entities/bullet"

export const reconcileActions = (gs: GameStateProps) => {
  for (const entity of gs.entities) {
    if (entity instanceof Champ) {
      const shoot = entity.state.publishQueue.filter((x) => x.name === "shoot")
      for (const shot of shoot) {
        if (gs.stats.ammo.curr > 0) {
          gs.stats.ammo.curr -= 1

          const isVert = Math.abs(shot.velocity[1]) > 0

          const actualPos: Coors = isVert
            ? [
                shot.initPos[0] - mBulletConst.dimensions[1] / 2,
                shot.initPos[1]
              ]
            : [
                shot.initPos[0],
                shot.initPos[1] - mBulletConst.dimensions[1] / 2
              ]

          gs.entities.push(new Bullet(actualPos, shot.velocity))
        }
      }
      entity.state.publishQueue = entity.state.publishQueue.filter(
        (p) => p.name !== "shoot"
      )

      updateCameraWithPlayer(gs.camera, entity)
      updateKeys(gs.keys, entity.state)
    }
  }
}
