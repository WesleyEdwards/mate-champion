import {Coors} from "../../entities/entityTypes"
import {areEntitiesTouching, toCurrAndPrev} from "../../helpers"
import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "../../loopShared/constants"
import {withCamPosition} from "../editHelpers"
import {BaseThing} from "../GameEdit"

export function InputMixin<T extends BaseThing>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateMouseHover)
      this.registerStepFunction(this.updateDragSelect)
      this.registerStepFunction(this.updateCanvasMovement)
      this.registerStepFunction(this.updateKeys, 1_000)
    }

    private updateKeys = () => {
      Object.values(this.state.keys).forEach((obj) => {
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

      if (this.state.keys.mouseDown.curr && this.hoveringEntities.size === 0) {
        return "move"
      }

      if (this.state.keys.ctrl.curr) {
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
        this.state.keys.mouseDown.curr &&
        this.hoveringEntities.size === 0 &&
        !this.dragSelection &&
        !this.sizableEntity

      const mp = this.state.keys.mousePos
      if (canManuallyMoveCanvas) {
        if (mp.curr && mp.prev) {
          const diff: Coors = [
            -mp.curr[0] + mp.prev[0],
            mp.curr[1] - mp.prev[1]
          ]
          const proposedPos: Coors = [
            this.state.camera.position[0] + diff[0],
            this.state.camera.position[1] + diff[1]
          ]
          this.attemptToMoveCam(proposedPos)
        }
      }

      if (this.moving && mp.curr) {
        const proposedPos: Coors = [...this.state.camera.position]

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
      const camPos = this.state.camera.position
      if (proposedPos[0] < -200 || proposedPos[0] > 10_000) {
        proposedPos[0] = camPos[0]
      }
      if (proposedPos[1] < 0 || proposedPos[1] > 500) {
        proposedPos[1] = camPos[1]
      }
      this.state.camera.position = [...proposedPos]
      return [camPos[0] - proposedPos[0], camPos[1] - proposedPos[1]]
    }
  }
}
