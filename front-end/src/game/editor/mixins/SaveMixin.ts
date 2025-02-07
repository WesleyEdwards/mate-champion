import {LevelMap} from "../../../api/types"
import {Groog} from "../../entities/groog"
import {Platform} from "../../entities/platform"
import {WithEvents} from "../GameEdit"

export function SaveMixin<T extends WithEvents>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.registerStepFunction(this.updateSave)
    }
    updateSave = () => {
      if (this.state.timers.sinceLastSave.val > 500) {
        this.state.timers.sinceLastSave.val = 0
        this.setLevels(this.editStateToLevelInfo())
      }
    }

    editStateToLevelInfo(): Partial<LevelMap> {
      return {
        endPosition:
          this.entities.find((e) => e.typeId === "endGate")?.position
            ?.curr?.[0] ?? 4500,
        champInitPos: this.entities.find((e) => e.typeId === "player")?.position
          ?.curr ?? [400, 400],
        floors: this.entities
          .filter((e) => e.typeId === "floor")
          .map((f) => ({
            x: f.posLeft,
            width: f.width
          })),
        platformColor: this.state.prevBaseColor,
        platforms: this.entities
          .filter((e) => e.typeId === "platform")
          .map((f) => ({
            position: [...f.position.curr],
            dimensions: [...f.dimensions],
            color: (f as Platform).color
          })),
        groog: this.entities
          .filter((e) => e.typeId === "groog")
          .map((g) => ({
            position: [...g.position.curr],
            moveSpeed: Math.abs((g as Groog).velocity[0]),
            facingRight: (g as Groog).info.facingRight,
            timeBetweenJump: (g as Groog).info.timeBetweenJump,
            timeBetweenTurn: (g as Groog).info.timeBetweenTurn
          })),
        packages: this.entities
          .filter((e) => e.typeId === "ammo")
          .map((p) => [...p.position.curr])
      }
    }
  }
}
