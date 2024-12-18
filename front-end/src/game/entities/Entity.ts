import {toCurrAndPrev} from "../helpers"
import {generateRandomInt} from "../loopShared/utils"
import {PlayStats} from "../state/models"
import {EntityType, CurrAndPrev, Coors, Constructor} from "./entityTypes"

export type BaseEntityProps = {
  typeId: EntityType
  position: Coors
  dimensions: Coors
}

export interface Entity {
  id: string
  typeId: EntityType
  position: CurrAndPrev
  dimensions: Coors
  dead: boolean

  posLeft: number
  posRight: number
  posTop: number
  posBottom: number
  width: number
  height: number

  step(deltaT: number): void
  render(cxt: CanvasRenderingContext2D): void
  handleInteraction?(entities: BaseEntity[]): void
  modifyStatsOnDeath?: Partial<PlayStats>
}

export type EntityConstructor = Constructor<BaseEntity>

export class BaseEntity {
  id: string
  typeId: EntityType
  position: CurrAndPrev
  dimensions: Coors
  dead = false

  constructor(params: BaseEntityProps) {
    this.id = `${params.typeId}-${generateRandomInt(0, 10000)}`
    this.typeId = params.typeId
    this.position = toCurrAndPrev(params.position)
    this.dimensions = [...params.dimensions]
  }

  // Optional interaction and death modification methods
  handleInteraction?(entities: BaseEntity[]): void
  modifyStatsOnDeath?: Partial<PlayStats>

  get posLeft(): number {
    return this.position.curr[0]
  }
  get posRight(): number {
    return this.position.curr[0] + this.dimensions[0]
  }
  get posTop(): number {
    return this.position.curr[1]
  }
  get posBottom(): number {
    return this.position.curr[1] + this.dimensions[1]
  }
  get width(): number {
    return this.dimensions[0]
  }
  get height(): number {
    return this.dimensions[1]
  }
}
