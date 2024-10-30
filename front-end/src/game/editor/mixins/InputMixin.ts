import {Coors} from "../../entities/entityTypes"
import {areEntitiesTouching, toCurrAndPrev} from "../../helpers"
import { LevelMap } from "../../loopShared/models"
import {incrementPosition, withCamPosition} from "../editHelpers"
import {BaseThing, GameEdit} from "../GameEdit"



export function InputMixin<T extends BaseThing>(Base: T) {
  return class InputMixin extends Base {
    updateMouseHover() {
      if (this.state.keys.ctrl.curr) {
        if (this.hoveringEntities.size > 0) {
          this.canvas.style.cursor = "pointer"
        } else {
          this.canvas.style.cursor = "crosshair"
        }
      } else if (
        this.hoveringEntities.size > 0 ||
        this.movingEntities.size > 0
      ) {
        this.canvas.style.cursor = "grab"
      } else {
        this.canvas.style.cursor = "auto"
      }

      if (this.dragSelection) return
      const isMovingCanvas =
        // this.movingEntities.size === 0 &&
        this.state.keys.mouseDown.curr && this.hoveringEntities.size === 0
      if (isMovingCanvas) {
        this.canvas.style.cursor = "move"
      }
    }

    updateDragSelect() {
      const justStartedDragSelecting =
        this.state.keys.shift.curr &&
        this.state.keys.mouseDown.prev === false &&
        this.state.keys.mouseDown.curr === true

      if (!this.state.keys.mousePos.curr) {
        return
      }
      const mp = withCamPosition(
        this.state.keys.mousePos.curr,
        this.state.camera
      )

      if (justStartedDragSelecting) {
        this.dragSelection = {init: [...mp], dragPos: toCurrAndPrev([...mp])}
      }

      if (this.state.keys.mouseUp.curr) {
        this.dragSelection = null
      }

      if (this.dragSelection) {
        const dragPos = this.dragSelection.dragPos
        if (
          dragPos.curr[0] !== dragPos.prev[0] ||
          dragPos.curr[1] !== dragPos.prev[1]
        ) {
          this.selectedEntities.clear()
          for (const entity of this.state.entities) {
            if (
              areEntitiesTouching(entity.state, {
                position: {
                  curr: [
                    Math.min(this.dragSelection.init[0], dragPos.curr[0]),
                    Math.min(this.dragSelection.init[1], dragPos.curr[1])
                  ]
                },
                dimensions: [
                  Math.abs(dragPos.curr[0] - this.dragSelection.init[0]),
                  Math.abs(dragPos.curr[1] - this.dragSelection.init[1])
                ]
              })
            ) {
              this.selectedEntities.add(entity.id)
            }
          }
        }
        dragPos.prev = [...dragPos.curr]
        dragPos.curr = [...mp]
      }
    }

    updateCanvasMovement() {
      if (!this.isMovingCanvas) return
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          -this.state.keys.mousePos.curr[0] + this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1]
        ]
        const proposedPos: Coors = [
          this.state.camera.position[0] + diff[0],
          this.state.camera.position[1] + diff[1]
        ]
        if (proposedPos[0] < -200 || proposedPos[0] > 10_000) {
          diff[0] = 0
        }
        if (proposedPos[1] < 0 || proposedPos[1] > 500) {
          diff[1] = 0
        }
        incrementPosition(this.state.camera.position, diff)
      }
    }
  }
}
