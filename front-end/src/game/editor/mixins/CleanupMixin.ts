import {AddableEntity} from "../../../components/GameEdit/CourseBuilderSettings"
import {Ammo} from "../../entities/Ammo"
import {Entity} from "../../entities/Entity"
import {Coors, CurrAndPrev, EntityOfType} from "../../entities/entityTypes"
import {Groog} from "../../entities/groog"
import {Platform, Floor} from "../../entities/platform"
import {pointInsideEntity} from "../../helpers"
import {MAX_CANVAS_HEIGHT} from "../../loopShared/constants"
import {
  Edges,
  Edge,
  toRounded,
  toRoundedNum,
  withCamPosition
} from "../editHelpers"
import {BaseThing} from "../GameEdit"

export function CleanupMixin<T extends BaseThing>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.handleStateCleanup)
      this.registerStepFunction(this.updateSizableEntity)
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
          e.position.curr = toRounded(e.position.curr)
        })
      }

      if (this.state.keys.copy.curr) {
        this.currentlySelected.forEach((e) => {
          const copyOfWithOffset = (coors: CurrAndPrev): Coors => {
            const correctForY =
              coors.curr[0] + 80 > MAX_CANVAS_HEIGHT ? -100 : 100
            return [coors.curr[0] + 100, coors.curr[1] + correctForY]
          }
          const newE = this.copyEntity(e, copyOfWithOffset)
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

    updateSizableEntity = () => {
      const s = this.sizableEntity
      if (this.state.keys.mouseDown.curr === false && s) {
        // Commit changes
        const currE = this.state.entities.find((e) => e.id === s.entityId)
        if (currE) {
          currE.dimensions = [...s.proposed.dimensions]
          currE.position.curr = [...s.proposed.position.curr]
        }

        this.sizableEntity = null
      }

      if (this.moving?.entities) {
        return
      }

      if (s?.state !== "drag") {
        for (const entity of this.state.entities) {
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
      if (s?.state === "drag" && this.state.keys.mousePos.curr) {
        newPositionAndDimensions(
          s.proposed,
          s.edge,
          withCamPosition(this.state.keys.mousePos.curr, this.state.camera)
        )
      }
    }
    mouseOnEdge = (e: Entity): Edges | null => {
      const curr = this.state.keys.mousePos.curr
      if (!curr) return null
      const mousePos = withCamPosition(curr, this.state.camera)

      if (!pointInsideEntity(e, mousePos, 10)) return null
      const distFromEntity = 6

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
        ammo: (old) => new Ammo(old.position.curr)
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
    Edge,
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
