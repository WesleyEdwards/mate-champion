import {Groog} from "../../entities/groog"
import {Floor, Platform} from "../../entities/platform"
import {LevelMap} from "../../loopShared/models"
import {BaseThing, GameEdit} from "../GameEdit"

export function SaveMixin<T extends BaseThing>(Base: T) {
  return class SaveMixin extends Base {
    updateSave() {
      if (this.state.timers.sinceLastSave.val > 500) {
        this.state.timers.sinceLastSave.val = 0
        this.setLevels(this.editStateToLevelInfo())
        localStorage.setItem(
          "edit-coors",
          JSON.stringify(this.state.camera.position)
        )
      }
    }

    editStateToLevelInfo(): Partial<LevelMap> {
      const gs = this.state
      return {
        endPosition: gs.endPosition,
        champInitPos: gs.entities.find((e) => e.typeId === "player")?.position
          ?.curr ?? [400, 400],
        floors: gs.entities
          .filter((e) => e.typeId === "floor")
          .map((f) => ({
            x: f.posLeft,
            width: f.width,
            color: (f as Floor).color
          })),
        platformColor: gs.prevBaseColor,
        platforms: gs.entities
          .filter((e) => e.typeId === "platform")
          .map((f) => ({
            position: [...f.position.curr],
            dimensions: [...f.dimensions],
            color: (f as Platform).color
          })),
        groog: gs.entities
          .filter((e) => e.typeId === "groog")
          .map((g) => ({
            position: [...g.position.curr],
            moveSpeed: (g as Groog).velocity[0],
            timeBetweenJump: (g as Groog).state.timeBetweenJump,
            timeBetweenTurn: (g as Groog).state.timeBetweenTurn
          })),
        packages: gs.entities
          .filter((e) => e.typeId === "ammo")
          .map((p) => [...p.position.curr])
      }
    }
  }
}
