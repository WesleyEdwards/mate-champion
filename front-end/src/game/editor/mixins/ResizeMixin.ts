import {Entity} from "../../entities/Entity"
import {Coors} from "../../entities/entityTypes"
import {copyEntity} from "../editEntityHelpers"
import {Edges, toRoundedNum} from "../editHelpers"
import {WithCamera} from "../GameEdit"

export function ResizeMixin<T extends WithCamera>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateSizableEntity)
    }
    updateSizableEntity = () => {
      const s = this.sizableEntity
      if (this.userInput.mouseDown.curr === false && s) {
        if (s.state === "drag") {
          const old = this.entities.find((e) => e.id === s.entityId)!
          this.command({
            type: "resize",
            old: copyEntity(old),
            entityId: s.entityId,
            proposed: s.proposed
          })
        }
        this.sizableEntity = null
      }

      if (this.moving?.entities) {
        return
      }

      if (s?.state !== "drag") {
        for (const entity of this.entities) {
          if (entity.typeId !== "platform" && entity.typeId !== "floor") {
            continue
          }
          const onEdge = this.mouseOnEdge(entity)
          if (onEdge) {
            this.sizableEntity = {
              edge: onEdge,
              entityId: entity.id,
              proposed: copyEntity(entity),
              state: this.justPutMouseDown() ? "drag" : "hover"
            }
          }
        }
      }
      if (s?.state === "drag" && this.userInput.mousePos.curr) {
        newPositionAndDimensions(
          s.proposed,
          s.edge,
          this.withCamPosition(this.userInput.mousePos.curr)
        )
      }
    }

    mouseOnEdge = (e: Entity): Edges | null => {
      const curr = this.userInput.mousePos.curr
      if (!curr) return null
      if (!this.pointInsideEntity(e, curr, 10)) return null
      const distFromEntity = 6

      const mousePos = this.withCamPosition(curr)
      const right = Math.abs(e.posRight - mousePos[0]) < distFromEntity
      const left = Math.abs(e.posLeft - mousePos[0]) < distFromEntity
      const top = Math.abs(e.posTop - mousePos[1]) < distFromEntity
      const bottom = Math.abs(e.posBottom - mousePos[1]) < distFromEntity
      const edges: Edges = {x: null, y: null}
      if (right) edges.x = "right"
      if (left) edges.x = "left"
      if (top) edges.y = "top"
      if (bottom) edges.y = "bottom"
      if (edges.x === null && edges.y === null) return null
      return edges
    }
  }
}
const newPositionAndDimensions = (
  entity: Entity,
  edges: Edges,
  newMousePosition: Coors
) => {
  const map: Record<
    "bottom" | "top" | "left" | "right",
    (params: {entity: Entity; newMousePosition: Coors}) => void
  > = {
    bottom: ({entity, newMousePosition}) => {
      if (newMousePosition[1] < entity.posTop + 20) {
        return
      }
      const newBottom = newMousePosition[1]
      entity.dimensions[1] = toRoundedNum(newBottom) - entity.posTop
    },
    top: ({entity, newMousePosition}) => {
      if (newMousePosition[1] > entity.posBottom - 20) {
        return
      }
      const newTop = toRoundedNum(newMousePosition[1])
      const oldBottom = entity.posBottom
      entity.position.curr[1] = newTop
      entity.dimensions[1] = oldBottom - newTop
    },
    left: ({entity, newMousePosition}) => {
      if (newMousePosition[0] > entity.posRight - 20) {
        return
      }
      const newLeft = toRoundedNum(newMousePosition[0])
      const oldRight = entity.posRight
      entity.position.curr[0] = newLeft
      entity.dimensions[0] = oldRight - newLeft
    },
    right: ({entity, newMousePosition}) => {
      if (newMousePosition[0] < entity.posLeft + 20) {
        return
      }
      const newRight = toRoundedNum(newMousePosition[0])
      entity.dimensions[0] = newRight - entity.posLeft
    }
  }

  if (edges.x) {
    map[edges.x]({entity, newMousePosition})
  }
  if (edges.y) {
    map[edges.y]({entity, newMousePosition})
  }
}
