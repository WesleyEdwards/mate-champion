import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Coors, Entity} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Floor, Platform, floorConst} from "../../entities/platform"
import {
  bottomPos,
  leftPos,
  rightPos,
  toCurrAndPrev,
  topPos
} from "../../helpers"
import {platformConst} from "../../loopShared/constants"
import {incrementPosition, withCamPosition} from "../editHelpers"
import {BaseThing, GameEdit} from "../GameEdit"

export function MutateEntityMixin<T extends BaseThing>(Base: T) {
  return class MutateEntityMixin extends Base {
    updateEntities() {
      this.updateEntitySelection()
      this.updateEntityMovement()

      const shouldAddEntity =
        this.state.keys.ctrl.curr &&
        this.state.keys.mousePos.curr &&
        this.state.keys.mouseUp.curr &&
        this.hoveringEntities.size === 0 &&
        this.movingEntities.size === 0

      if (shouldAddEntity) {
        this.addEntityToState()
      }
    }

    private updateEntitySelection() {
      if (!this.state.keys.mousePos.curr) {
        return new Set()
      }
      const mouse = withCamPosition(
        this.state.keys.mousePos.curr,
        this.state.camera
      )
      this.hoveringEntities = new Set(
        this.state.entities
          .filter((e) => {
            const isX = leftPos(e) + 3 < mouse[0] && rightPos(e) - 3 > mouse[0]
            const isY = topPos(e) + 3 < mouse[1] && bottomPos(e) - 3 > mouse[1]
            return isX && isY
          })
          .map((e) => e.id)
      )
    }

    private updateEntityMovement() {
      if (this.movingEntities.size === 0) {
        return
      }
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          this.state.keys.mousePos.curr[0] - this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1]
        ]
        this.movingEntities.forEach((entity) => {
          const e = this.fromId(entity)
          if (!e) return
          const d: Coors =
            e.typeId === "floor" || e.typeId === "endGate"
              ? [diff[0], 0]
              : [...diff]
          incrementPosition(e.state.position.curr, d)
        })
      }
    }

    private addEntityToState() {
      if (!this.state.keys.mouseUp.curr) return

      const addable: Record<AddableEntity, Entity> = {
        groog: new Groog({
          moveSpeed: 0.3,
          position: [0, 0],
          timeBetweenJump: 2000,
          timeBetweenTurn: 3000
        }),
        floor: new Floor({color: "springgreen", startX: 0, width: 1000}),
        platform: new Platform({
          color: window.addingEntity.baseColor ?? "springgreen",
          position: [0, 0],
          dimensions: [300, platformConst.defaultHeight]
        }),
        ammo: new Ammo([0, 0])
      }

      const toAdd = window.addingEntity.type ?? "platform"

      const entity = addable[toAdd]
      const pos = this.state.keys.mouseUp.curr

      const center: Coors = [
        pos[0] - entity.state.dimensions[0] / 2,
        pos[1] - entity.state.dimensions[1] / 2
      ]

      entity.state.position = toCurrAndPrev(
        withCamPosition(center, this.state.camera)
      )

      if (entity.typeId === "floor") {
        // Should probably do this higher up in the fun, but this works for now
        entity.state.position.curr[1] = floorConst.floorY
      }
      this.state.entities.push(entity)
    }
  }
}
