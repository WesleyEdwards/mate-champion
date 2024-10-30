import {Coors} from "../../entities/entityTypes"
import {bottomPos, leftPos, rightPos, topPos} from "../../helpers"
import {incrementPosition, withCamPosition} from "../editHelpers"
import {BaseThing, GameEdit} from "../GameEdit"

export function MutateEntityMixin<T extends BaseThing>(Base: T) {
  return class MutateEntityMixin extends Base {
    updateEntitySelection() {
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

    updateEntityMovement() {
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
  }
}
