import {Entity} from "../../entities/Entity"
import {renderBg} from "../../render/background"
import {accountForPosition} from "../../render/helpers"
import {Edge, toRounded} from "../editHelpers"
import {BaseThing} from "../GameEdit"

export function RenderMixin<T extends BaseThing>(Base: T) {
  return class extends Base {
    render(cxt: CanvasRenderingContext2D) {
      const camPos = this.state.camera.position
      cxt.save()
      cxt.translate(-camPos[0], camPos[1])

      renderBg(this.state.camera, cxt)

      for (const entity of this.state.entities) {
        cxt.save()
        if (this.sizableEntity?.entityId === entity.id) {
          this.renderEntity(this.sizableEntity.proposed, cxt)
        } else {
          this.renderEntity(entity, cxt)
        }
        cxt.restore()
      }

      if (this.dragSelection) {
        cxt.save()
        accountForPosition(toRounded(this.dragSelection.init), cxt)

        const placement = [
          0,
          0,
          this.dragSelection.dragPos.curr[0] - this.dragSelection.init[0],
          this.dragSelection.dragPos.curr[1] - this.dragSelection.init[1]
        ] as const

        cxt.strokeStyle = "black"
        cxt.lineWidth = 2
        cxt.fillStyle = "#00000024"

        cxt.strokeRect(...placement)
        cxt.beginPath()
        cxt.rect(...placement)
        cxt.fill()
        cxt.restore()
      }

      if (this.sizableEntity) {
        const entity = this.sizableEntity.proposed
        accountForPosition(entity.position.curr, cxt)
        this.drawEdge(entity, this.sizableEntity.edge, cxt, "red")
      }

      cxt.restore()
    }

    renderEntity = (entity: Entity, cxt: CanvasRenderingContext2D) => {
      accountForPosition(toRounded(entity.position.curr), cxt)

      const onEdge =
        this.sizableEntity?.entityId === entity.id
          ? this.sizableEntity.edge
          : null
      if (onEdge) {
        this.drawEdge(entity, onEdge, cxt, "blue")
      }

      if (this.moving?.entities?.has(entity.id)) {
        cxt.globalAlpha = 0.25
        entity.render(cxt)
        accountForPosition(this.moving.delta, cxt)
        cxt.globalAlpha = 1
        entity.render(cxt)
      } else {
        entity.render(cxt)
      }

      if (this.selectedEntities.has(entity.id)) {
        cxt.strokeStyle = "red"
        cxt.lineWidth = 2
        cxt.strokeRect(0, 0, entity.width, entity.height)
      }
    }

    private drawEdge = (
      entity: Entity,
      sizeEdge: Edge | null,
      cxt: CanvasRenderingContext2D,
      color: string
    ) => {
      if (!sizeEdge) return

      cxt.beginPath()
      cxt.fillStyle = color
      cxt.strokeStyle = color
      cxt.lineWidth = 8
      ;({
        right: () => {
          cxt.moveTo(entity.dimensions[0], 0)
          cxt.lineTo(entity.dimensions[0], entity.dimensions[1])
        },
        left: () => {
          cxt.moveTo(0, 0)
          cxt.lineTo(0, entity.dimensions[1])
        },
        top: () => {
          cxt.moveTo(0, 0)
          cxt.lineTo(entity.dimensions[0], 0)
        },
        bottom: () => {
          cxt.moveTo(0, entity.dimensions[1])
          cxt.lineTo(entity.dimensions[0], entity.dimensions[1])
        }
      })[sizeEdge]()

      cxt.stroke()
    }
  }
}
