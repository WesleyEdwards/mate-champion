import {Entity} from "../../entities/Entity"
import {Coors, CurrAndPrev} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Platform} from "../../entities/platform"
import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "../../loopShared/constants"
import {copyEntity} from "../editEntityHelpers"
import {getGlobalEditing, toRounded, toRoundedNum} from "../editHelpers"
import {WithCamera} from "../GameEdit"

export function CleanupMixin<T extends WithCamera>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.handleStateCleanup)
    }
    handleStateCleanup = () => {
      if (this.userInput.delete.curr && this.userInput.mousePos.curr) {
        this.command({
          type: "remove",
          entities: this.entities.filter((e) => this.selectedEntities.has(e.id))
        })
        this.userInput.delete.curr = false
      }
      const mouseUpAction =
        this.userInput.mouseUp.curr && !this.userInput.mouseUp.prev
      if (mouseUpAction) {
        // lock rounded into place.
        this.entities.forEach((e) => {
          e.position.curr = toRounded(e.position.curr)
        })
      }

      if (this.userInput.copy) {
        const copyOfWithOffset = (c: CurrAndPrev): Coors => {
          const coors = this.withoutCamPosition(c.curr)
          const toTheTop = coors[1] > MAX_CANVAS_HEIGHT / 4
          const toTheRight = coors[0] < MAX_CANVAS_WIDTH * 0.75
          const correctForX = c.curr[0] + (toTheRight ? 100 : -100)
          const correctForY = c.curr[1] + (toTheTop ? -100 : 100)
          return [correctForX, correctForY]
        }

        const newEntities = this.currentlySelected
          .filter(
            (e) =>
              e.typeId === "groog" ||
              e.typeId === "floor" ||
              e.typeId === "platform" ||
              e.typeId === "ammo"
          )
          .map((e) => copyEntity(e, copyOfWithOffset))
        this.command({type: "add", entities: newEntities})
        this.userInput.copy = false
      }
      for (const e of this.entities) {
        if (e instanceof Groog) {
          e.info.moveSpeed = Math.abs(e.velocity[0])
          
          e.velocity[0] = e.info.facingRight
            ? Math.abs(e.velocity[0])
            : -Math.abs(e.velocity[0])
        }
      }

      this.userInput.mouseUp.prev = this.userInput.mouseUp.curr
      this.userInput.mouseUp.curr = null

      // reconcile colors
      const bc = getGlobalEditing().addingEntity.baseColor
      if (bc && bc !== this.state.prevBaseColor) {
        this.entities.forEach((e) => {
          if (e instanceof Platform) {
            if (e.color === this.state.prevBaseColor) {
              e.color = bc
            }
          }
        })
        this.state.prevBaseColor = bc
      }
    }
  }
}
