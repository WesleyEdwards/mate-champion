import {Entity} from "../../entities/Entity"
import {Coors} from "../../entities/entityTypes"
import {WithEvents} from "../GameEdit"

export function CameraMixin<TBase extends WithEvents>(Base: TBase) {
  return class extends Base {
    camera: {position: Coors} = {position: [0, 0]}
    constructor(...args: any[]) {
      super(...args)
      const initCoors = JSON.parse(
        localStorage.getItem("edit-coors") ?? "[0,0]"
      )
      this.camera.position = [
        Math.max(0, initCoors[0]),
        Math.max(0, initCoors[1])
      ]

      this.registerStepFunction(this.updateSave)
    }

    withCamPosition = (curr: Coors): Coors => [
      curr[0] + this.camera.position[0],
      curr[1] - this.camera.position[1]
    ]

    withoutCamPosition = (curr: Coors): Coors => [
      curr[0] - this.camera.position[0],
      curr[1] + this.camera.position[1]
    ]

    updateSave = () => {
      if (this.state.timers.sinceLastSaveCamPos.val > 500) {
        this.state.timers.sinceLastSaveCamPos.val = 0
        localStorage.setItem("edit-coors", JSON.stringify(this.camera.position))
      }
    }

    pointInsideEntity = (
      e: Entity,
      point: Coors,
      distOutsideOfEntityThreshHold?: number
    ) => {
      const pos = this.withCamPosition(point)
      const dist = distOutsideOfEntityThreshHold ?? 0
      const isX = e.posLeft - dist < pos[0] && e.posRight + dist > pos[0]
      const isY = e.posTop - dist < pos[1] && e.posBottom + dist > pos[1]
      return isX && isY
    }
  }
}
