import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Entity} from "../../entities/Entity"
import {Coors, CurrAndPrev, EntityOfType} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Platform, Floor} from "../../entities/platform"
import {MAX_CANVAS_HEIGHT} from "../../loopShared/constants"
import {BaseThing} from "../GameEdit"

export function CleanupMixin<T extends BaseThing>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.handleStateCleanup)
    }
    handleStateCleanup = () => {
      if (this.state.entities.some((e) => e.dead)) {
        this.state.entities = this.state.entities.filter((e) => !e.dead)
      }

      if (this.state.keys.delete.curr && this.state.keys.mousePos.curr) {
        this.state.entities = this.state.entities.filter(
          (e) => !this.selectedEntities.has(e.id)
        )
        this.state.keys.delete.curr = false
      }
      const mouseUpAction =
        this.state.keys.mouseUp.curr && !this.state.keys.mouseUp.prev
      if (mouseUpAction) {
        // lock rounded into place.
        this.state.entities.forEach((e) => {
          e.position.curr = this.toRounded(e.position.curr)
        })
      }

      if (this.state.keys.copy.curr) {
        this.currentlySelected.forEach((e) => {
          const newE = this.copyEntity(e)
          if (newE) {
            this.state.entities.push(newE)
            this.selectedEntities.delete(e.id)
            this.selectedEntities.add(newE.id)
          }
        })
        this.state.keys.copy.curr = false
      }

      this.state.keys.mouseUp.curr = null
      this.state.endPosition =
        this.state.entities.find((e) => e.typeId === "endGate")?.position
          ?.curr?.[0] ?? 4500

      // reconcile colors
      const bc = window.addingEntity.baseColor
      if (bc && bc !== this.state.prevBaseColor) {
        this.state.entities.forEach((e) => {
          if (e instanceof Platform) {
            if (e.color === this.state.prevBaseColor) {
              e.color = bc
            }
          }
        })
        this.state.prevBaseColor = bc
      }
    }

    private copyEntity = (e: Entity): Entity | undefined => {
      if (
        e.typeId === "endGate" ||
        e.typeId === "player" ||
        e.typeId === "floor" ||
        e.typeId === "bullet"
      ) {
        return undefined
      }
      const copyOfWithOffset = (coors: CurrAndPrev): Coors => {
        const correctForY = coors.curr[0] + 80 > MAX_CANVAS_HEIGHT ? -100 : 100
        return [coors.curr[0] + 100, coors.curr[1] + correctForY]
      }

      const map: {
        [K in AddableEntity]: (old: EntityOfType[K]) => EntityOfType[K]
      } = {
        groog: (old) =>
          new Groog({
            moveSpeed: old.velocity[0],
            position: copyOfWithOffset(old.position),
            timeBetweenJump: old.state.timeBetweenJump,
            timeBetweenTurn: old.state.timeBetweenTurn
          }),
        floor: (old) =>
          new Floor({
            color: old.color,
            startX: old.posLeft,
            width: old.width
          }),
        platform: (old) =>
          new Platform({
            color: old.color,
            dimensions: [old.width, old.height],
            position: copyOfWithOffset(old.position)
          }),
        ammo: (old) => new Ammo(old.position.curr)
      }
      return map[e.typeId](e as never)
    }
  }
}
