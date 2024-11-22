import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Entity} from "../../entities/Entity"
import {Coors} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Floor, Platform, floorConst} from "../../entities/platform"
import {pointInsideEntity, toCurrAndPrev} from "../../helpers"
import {platformConst} from "../../loopShared/constants"
import {incrementPosition} from "../editHelpers"
import {WithCamera, WithEvents} from "../GameEdit"

export function MutateEntityMixin<T extends WithCamera>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateEntitySelection)
      this.registerStepFunction(this.updateEntityMovement)
      this.registerStepFunction(this.startMovingEntities)
      this.registerStepFunction(this.addEntityToState)
      this.registerStepFunction(this.finishMovingEntities)
      this.registerStepFunction(this.checkNowMoving)
    }

    private updateEntitySelection = () => {
      if (!this.userInput.mousePos.curr) {
        return new Set()
      }
      const mouse = this.withCamPosition(this.userInput.mousePos.curr)

      this.hoveringEntities = new Set(
        this.entities
          .filter((e) => pointInsideEntity(e, mouse, -3))
          .map((e) => e.id)
      )
    }

    private startMovingEntities = () => {
      const justMouseUpped = this.hasClicked()

      const ctrl = this.userInput.ctrl.curr
      const entityOnTop = Array.from(this.hoveringEntities).pop()

      const alreadySelected = this.selectedEntities.has(entityOnTop ?? "")
      if (!justMouseUpped) {
        const startingToGrab =
          this.justPutMouseDown() && !this.userInput.shift.curr
        if (!ctrl && entityOnTop && startingToGrab) {
          // grab one entity and start dragging.
          // const
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
        if (alreadySelected) {
          this.selectedEntities.delete(entityOnTop)
        } else {
          this.selectedEntities.add(entityOnTop)
        }
        return
      }
      if (entityOnTop && !ctrl) {
        this.selectedEntities.clear()
        if (entityOnTop) {
          this.selectedEntities.add(entityOnTop)
        }
        // if (!alreadySelected) {
        //   this.selectedEntities.add(entityOnTop)
        // }
      }

      if (!entityOnTop && !ctrl) {
        this.selectedEntities.clear()
        return
      }
    }
    checkNowMoving = () => {
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

    hasClicked = () => {
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

    private updateEntityMovement = () => {
      if (this.moving === null) {
        return
      }
      const mp = this.userInput.mousePos
      if (mp.curr && mp.prev) {
        const diff: Coors = [mp.curr[0] - mp.prev[0], mp.curr[1] - mp.prev[1]]
        incrementPosition(this.moving.delta, diff)
      }
    }

    private addEntityToState = () => {
      const input = this.userInput
      const shouldAddEntity =
        input.ctrl.curr &&
        input.mousePos.curr &&
        input.mouseUp.curr &&
        this.hoveringEntities.size === 0 &&
        this.moving === null
      if (!shouldAddEntity) {
        return
      }
      if (!input.mouseUp.curr) return

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
      const pos = input.mouseUp.curr

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
