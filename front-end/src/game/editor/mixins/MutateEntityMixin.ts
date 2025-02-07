import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Entity} from "../../entities/Entity"
import {Coors} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Floor, Platform} from "../../entities/platform"
import {toCurrAndPrev} from "../../helpers"
import {floorConst, platformConst} from "../../loopShared/constants"
import {
  areEqual,
  differenceBetween,
  getGlobalEditing,
  incrementPosition
} from "../editHelpers"
import {WithCamera} from "../GameEdit"

export function MutateEntityMixin<T extends WithCamera>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateHover)
      this.registerStepFunction(this.updateDraggingEntity)
      this.registerStepFunction(this.startMovingEntities)
      this.registerStepFunction(this.addEntityToState)
      this.registerStepFunction(this.finishMovingEntities)
      this.registerStepFunction(this.checkNowMoving)
    }

    private updateHover = () => {
      const mp = this.userInput.mousePos.curr
      if (!mp) return
      if (areEqual(mp, this.userInput.mousePos.prev ?? [0, 0])) {
        return
      }
      this.hoveringEntities = new Set(
        this.entities
          .filter((e) => this.pointInsideEntity(e, mp, -5))
          .map((e) => e.id)
      )
    }

    private updateDraggingEntity = () => {
      if (this.moving === null) return
      const mp = this.userInput.mousePos
      if (mp.curr && mp.prev) {
        incrementPosition(
          this.moving.delta,
          differenceBetween(mp.curr, mp.prev)
        )
      }
    }

    private startMovingEntities = () => {
      const ctrl = this.userInput.ctrl.curr
      const entityOnTop = Array.from(this.hoveringEntities).pop()

      // The hovering entity is already selected
      const alreadySelected = this.selectedEntities.has(entityOnTop ?? "")

      if (!this.justMouseUpped()) {
        const startingToGrab =
          this.justPutMouseDown() && !this.userInput.shift.curr
        if (!ctrl && entityOnTop && startingToGrab) {
          // grab one entity and start dragging.
          if (!alreadySelected) {
            this.selectedEntities.clear()
          }
          this.selectedEntities.add(entityOnTop)
          this.moving = {
            entities: new Set(this.selectedEntities),
            delta: [0, 0]
          }
        }
        return
      }

      if (ctrl && entityOnTop) {
        // Toggle between selected/not selected
        if (alreadySelected) {
          this.selectedEntities.delete(entityOnTop)
        } else {
          this.selectedEntities.add(entityOnTop)
        }
        return
      }

      if (ctrl) return

      this.selectedEntities.clear()

      if (entityOnTop) {
        this.selectedEntities.add(entityOnTop)
      }
    }

    private checkNowMoving = () => {
      const startingToGrab =
        this.justPutMouseDown() && !this.userInput.shift.curr

      // check for hovering to allow resizing one that is selected
      if (
        startingToGrab &&
        this.selectedEntities.size > 0 &&
        this.hoveringEntities.size > 0
      ) {
        this.moving = {
          entities: new Set(this.selectedEntities),
          delta: [0, 0]
        }
      }
    }

    private justMouseUpped = () => {
      const prev = this.userInput.mouseDown.prev
      const mp = this.userInput.mousePos.curr
      const mouseDown = this.userInput.mousePutDown.curr
      return (
        prev &&
        mp &&
        !this.userInput.mouseDown.curr &&
        mouseDown &&
        Math.abs(mouseDown[0] - mp[0]) < 4 &&
        Math.abs(mouseDown[1] - mp[1]) < 4
      )
    }

    finishMovingEntities = () => {
      if (!this.moving) return
      const endGrab = !this.userInput.mouseDown.curr
      if (!endGrab) return
      const moved = this.moving

      this.moving = null

      if (Math.abs(moved.delta[0]) < 4 && Math.abs(moved.delta[1]) < 4) {
        return
      }
      this.command({type: "move", ...moved})
    }

    private addEntityToState = () => {
      const shouldAddEntity =
        this.userInput.ctrl.curr &&
        // this.justPutMouseDown() &&
        this.hoveringEntities.size === 0 &&
        this.moving === null

      if (!shouldAddEntity) {
        return
      }
      if (!this.userInput.mouseUp.curr) return

      const toAdd = getGlobalEditing().addingEntity.type ?? "platform"

      const entity = addableEntity(toAdd)
      const pos = this.userInput.mouseUp.curr

      const center: Coors = [
        pos[0] - entity.width / 2,
        pos[1] - entity.height / 2
      ]

      entity.position = toCurrAndPrev(this.withCamPosition(center))

      if (entity.typeId === "floor") {
        entity.position.curr[1] = floorConst.floorY
      }
      this.command({type: "add", entities: [entity]})
    }
  }
}

const addableEntity = (type: AddableEntity): Entity =>
  ({
    groog: new Groog({
      moveSpeed: 0.3,
      position: [0, 0],
      facingRight: true,
      timeBetweenJump: {
        time: 2000,
        type: "Time"
      },
      timeBetweenTurn: {
        time: 3000,
        type: "Time"
      }
    }),
    floor: new Floor({startX: 0, width: 1000}),
    platform: new Platform({
      color: window?.editor?.addingEntity?.baseColor ?? "springgreen",
      position: [0, 0],
      dimensions: [300, platformConst.defaultHeight]
    }),
    ammo: new Ammo([0, 0])
  })[type]
