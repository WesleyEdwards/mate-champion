import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Entity} from "../../entities/Entity"
import {Coors} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Floor, Platform, floorConst} from "../../entities/platform"
import {toCurrAndPrev} from "../../helpers"
import {platformConst} from "../../loopShared/constants"
import {incrementPosition, withCamPosition} from "../editHelpers"
import {BaseThing} from "../GameEdit"

export function MutateEntityMixin<T extends BaseThing>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateEntitySelection)
      this.registerStepFunction(this.updateEntityMovement)
      this.registerStepFunction(this.updateMoving)
      this.registerStepFunction(this.addEntityToState)
    }

    private updateEntitySelection = () => {
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
            const isX = e.posLeft + 3 < mouse[0] && e.posRight - 3 > mouse[0]
            const isY = e.posTop + 3 < mouse[1] && e.posBottom - 3 > mouse[1]
            return isX && isY
          })
          .map((e) => e.id)
      )
    }

    private updateMoving = () => {
      const mouseDownAction =
        this.state.keys.mouseDown.curr && !this.state.keys.mouseDown.prev

      const startingToGrab = mouseDownAction && !this.state.keys.shift.curr
      const stopGrabbing = !this.state.keys.mouseDown.curr

      if (startingToGrab) {
        if (
          this.state.keys.ctrl.curr === false &&
          this.selectedEntities.intersection(this.hoveringEntities).size === 0
        ) {
          this.selectedEntities.clear() // unselect when not ctrl click
        }

        const last = Array.from(this.hoveringEntities).pop()
        if (last) {
          this.selectedEntities.add(last)
        }

        if (this.selectedEntities.size > 0) {
          this.moving = {
            entities: new Set(this.selectedEntities),
            delta: [0, 0]
          }
        }
      } else if (stopGrabbing) {
        if (this.moving !== null) {
          const diff = this.moving.delta

          this.moving.entities.forEach((entity) => {
            const e = this.fromId(entity)
            if (!e) return
            const d: Coors =
              e.typeId === "floor" || e.typeId === "endGate"
                ? [diff[0], 0]
                : [...diff]
            incrementPosition(e.position.curr, d)
          })
        }

        this.moving = null
        for (const entity of this.state.entities) {
          entity.position.curr = this.toRounded([...entity.position.curr])
        }
      }
    }

    private updateEntityMovement = () => {
      if (this.moving === null) {
        return
      }
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          this.state.keys.mousePos.curr[0] - this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1]
        ]
        incrementPosition(this.moving.delta, diff)
      }
    }

    private addEntityToState = () => {
      const shouldAddEntity =
        this.state.keys.ctrl.curr &&
        this.state.keys.mousePos.curr &&
        this.state.keys.mouseUp.curr &&
        this.hoveringEntities.size === 0 &&
        this.moving === null
      if (!shouldAddEntity) {
        return
      }
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
        pos[0] - entity.width / 2,
        pos[1] - entity.height / 2
      ]

      entity.position = toCurrAndPrev(
        withCamPosition(center, this.state.camera)
      )

      if (entity.typeId === "floor") {
        // Should probably do this higher up in the fun, but this works for now
        entity.position.curr[1] = floorConst.floorY
      }
      this.state.entities.push(entity)
    }
  }
}
