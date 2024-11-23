import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Entity} from "../../entities/Entity"
import {Coors, CurrAndPrev, EntityOfType} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Platform, Floor} from "../../entities/platform"
import {MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH} from "../../loopShared/constants"
import {Edges, pointInsideEntity, toRounded, toRoundedNum} from "../editHelpers"
import {WithCamera, WithEvents} from "../GameEdit"

export function CleanupMixin<T extends WithCamera>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.handleStateCleanup)
      this.registerStepFunction(this.updateSizableEntity)
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

        const newEntities = this.currentlySelected.reduce<Entity[]>(
          (acc, e) => {
            const newE = this.copyEntity(e, copyOfWithOffset)
            if (newE) {
              acc.push(newE)
            }
            return acc
          },
          []
        )
        this.command({type: "add", entities: newEntities})
        this.userInput.copy = false
      }

      this.userInput.mouseUp.curr = null

      // reconcile colors
      const bc = window.editor.addingEntity.baseColor
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

    updateSizableEntity = () => {
      const s = this.sizableEntity
      if (this.userInput.mouseDown.curr === false && s) {
        if (s.state === "drag") {
          const old = this.entities.find((e) => e.id === s.entityId)!
          const oldCopy = this.copyEntity(old)
          this.command({
            type: "resize",
            old: oldCopy!,
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
            const copy = this.copyEntity(entity)
            if (copy) {
              this.sizableEntity = {
                edge: onEdge,
                entityId: entity.id,
                proposed: copy,
                state: this.justPutMouseDown() ? "drag" : "hover"
              }
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

    private copyEntity = (
      e: Entity,
      copyOfWithOffset?: (coors: CurrAndPrev) => Coors
    ): Entity | undefined => {
      if (
        e.typeId === "endGate" ||
        e.typeId === "player" ||
        e.typeId === "floor" ||
        e.typeId === "bullet"
      ) {
        return undefined
      }

      const map: {
        [K in AddableEntity]: (old: EntityOfType[K]) => EntityOfType[K]
      } = {
        groog: (old) =>
          new Groog({
            moveSpeed: old.velocity[0],
            position: copyOfWithOffset?.(old.position) ?? old.position.curr,
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
            position: copyOfWithOffset?.(old.position) ?? old.position.curr
          }),
        ammo: (old) =>
          new Ammo(copyOfWithOffset?.(old.position) ?? old.position.curr)
      }
      return map[e.typeId](e as never)
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
