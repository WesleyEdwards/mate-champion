import {BaseEntity} from "./Entity"
import {Constructor, Coors} from "./entityTypes"

export function WithVelocity<TBase extends Constructor<BaseEntity>>(
  Base: TBase
) {
  return class extends Base {
    velocity: Coors = [0, 0]

    move(deltaT: number) {
      this.position.prev[0] = this.position.curr[0]
      this.position.prev[1] = this.position.curr[1]

      this.position.curr[0] += this.velocity[0] * deltaT
      this.position.curr[1] += this.velocity[1] * deltaT
    }
  }
}
