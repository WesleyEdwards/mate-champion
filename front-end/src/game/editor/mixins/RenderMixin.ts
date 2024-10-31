import {renderBg} from "../../render/background"
import {accountForPosition} from "../../render/helpers"
import {BaseThing, GameEdit} from "../GameEdit"

export function RenderMixin<T extends BaseThing>(Base: T) {
  return class RenderMixin extends Base {
    render(cxt: CanvasRenderingContext2D) {
      const camPos = this.state.camera.position
      cxt.save()
      cxt.translate(-camPos[0], camPos[1])

      renderBg(this.state.camera, cxt)

      for (const entity of this.state.entities) {
        cxt.save()
        accountForPosition(this.toRounded(entity.state.position.curr), cxt)
        entity.render(cxt)

        if (this.selectedEntities.has(entity.id)) {
          cxt.strokeStyle = "red"
          cxt.lineWidth = 2

          cxt.strokeRect(
            0,
            0,
            entity.state.dimensions[0],
            entity.state.dimensions[1]
          )
        }
        cxt.restore()
      }

      if (this.dragSelection) {
        cxt.save()
        accountForPosition(this.toRounded(this.dragSelection.init), cxt)

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

      cxt.restore()
    }
  }
}
