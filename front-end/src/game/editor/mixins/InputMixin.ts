import {Coors} from "../../entities/entityTypes"
import {areEntitiesTouching, toCurrAndPrev} from "../../helpers"
import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "../../loopShared/constants"
import {getGlobalEditing, setGlobalEditing} from "../editHelpers"
import {WithCamera} from "../GameEdit"

export function InputMixin<T extends WithCamera>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateMouseHover)
      this.registerStepFunction(this.updateDragSelect)
      this.registerStepFunction(this.updateCanvasMovement)
      this.registerStepFunction(this.updateKeys, 1_000)
    }

    private updateKeys = () => {
      Object.values(this.userInput).forEach((obj) => {
        if (
          typeof obj === "string" ||
          obj === undefined ||
          typeof obj === "boolean"
        )
          return
        if (typeof obj.curr === "boolean") {
          obj.prev = obj.curr
        } else {
          if (obj.curr === null) {
            obj.prev = obj.curr
          } else {
            obj.prev = [...obj.curr]
          }
        }
      })

      this.userInput.undo = getGlobalEditing().action
      setGlobalEditing("action", undefined)

      if (this.state.timers.sinceLastUndoRedo.val > 200) {
        if (this.userInput.undo === "undo") {
          this.undo()
          this.state.timers.sinceLastUndoRedo.val = 0
        }
        if (this.userInput.undo === "redo") {
          this.redo()
          this.state.timers.sinceLastUndoRedo.val = 0
        }
        this.userInput.undo = undefined
      }
    }

    private updateMouseHover = () => {
      this.canvas.style.cursor = this.cursor
    }
    get cursor() {
      if (this.sizableEntity) {
        const edge = this.sizableEntity.edge
        if (edge.y === null) return "ew-resize"
        if (edge.x === null) return "ns-resize"
        if (
          (edge.x === "right" && edge.y === "top") ||
          (edge.x === "left" && edge.y === "bottom")
        ) {
          return "nesw-resize"
        }
        return "nwse-resize"
      }

      if (this.userInput.mouseDown.curr && this.hoveringEntities.size === 0) {
        return "move"
      }

      if (this.userInput.ctrl.curr) {
        if (this.hoveringEntities.size > 0) {
          return "pointer"
        } else {
          return "crosshair"
        }
      } else if (this.hoveringEntities.size > 0 || this.moving !== null) {
        return "grab"
      } else {
        return "auto"
      }
    }

    private updateDragSelect = () => {
      const justStartedDragSelecting =
        this.userInput.shift.curr &&
        this.userInput.mouseDown.prev === false &&
        this.userInput.mouseDown.curr === true

      if (!this.userInput.mousePos.curr) {
        return
      }
      const mp = this.withCamPosition(this.userInput.mousePos.curr)

      if (justStartedDragSelecting) {
        this.dragSelection = {init: [...mp], dragPos: toCurrAndPrev([...mp])}
      }

      if (this.userInput.mouseUp.curr) {
        this.dragSelection = null
      }

      if (this.dragSelection) {
        const dragPos = this.dragSelection.dragPos
        if (
          dragPos.curr[0] !== dragPos.prev[0] ||
          dragPos.curr[1] !== dragPos.prev[1]
        ) {
          this.selectedEntities.clear()
          for (const entity of this.entities) {
            if (
              areEntitiesTouching(entity, {
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

    private updateCanvasMovement = () => {
      const canManuallyMoveCanvas =
        this.moving === null &&
        this.userInput.mouseDown.curr &&
        this.hoveringEntities.size === 0 &&
        !this.dragSelection &&
        !this.sizableEntity

      const mp = this.userInput.mousePos
      if (canManuallyMoveCanvas) {
        if (mp.curr && mp.prev) {
          const diff: Coors = [
            -mp.curr[0] + mp.prev[0],
            mp.curr[1] - mp.prev[1]
          ]
          const proposedPos: Coors = [
            this.camera.position[0] + diff[0],
            this.camera.position[1] + diff[1]
          ]
          this.attemptToMoveCam(proposedPos)
        }
      }

      if (this.moving && mp.curr) {
        const proposedPos: Coors = [...this.camera.position]

        const distToMoveCanvas = 3
        const distFromEdge = 100
        if (mp.curr[0] < distFromEdge) {
          proposedPos[0] -= distToMoveCanvas
        }
        if (mp.curr[0] > MAX_CANVAS_WIDTH - distFromEdge) {
          proposedPos[0] += distToMoveCanvas
        }
        if (mp.curr[1] < distFromEdge) {
          proposedPos[1] += distToMoveCanvas
        }
        if (mp.curr[1] > MAX_CANVAS_HEIGHT - distFromEdge) {
          proposedPos[1] -= distToMoveCanvas
        }
        const moved = this.attemptToMoveCam(proposedPos)
        this.moving.delta[0] -= moved[0]
        this.moving.delta[1] += moved[1]
      }
    }

    // Returns the difference the cam was moved
    attemptToMoveCam = (proposedPos: Coors): Coors => {
      const camPos = this.camera.position
      if (proposedPos[0] < -200 || proposedPos[0] > 10_000) {
        proposedPos[0] = camPos[0]
      }
      if (proposedPos[1] < 0 || proposedPos[1] > 500) {
        proposedPos[1] = camPos[1]
      }
      this.camera.position = [...proposedPos]
      return [camPos[0] - proposedPos[0], camPos[1] - proposedPos[1]]
    }
  }
}
