import {LevelMap} from "../loopShared/models"
import {Coors, CurrAndPrev, Constructor, Id} from "../entities/entityTypes"
import {updateTime} from "../state/helpers"
import {updateTimers} from "../state/timeHelpers"
import {GameStateEditProps, levelInfoToEditState} from "./editHelpers"
import {addDevEventListeners} from "./eventListeners"
import {RenderMixin} from "./mixins/RenderMixin"
import {MutateEntityMixin} from "./mixins/MutateEntityMixin"
import {InputMixin} from "./mixins/InputMixin"
import {SaveMixin} from "./mixins/SaveMixin"
import {Entity} from "../entities/Entity"
import {CleanupMixin} from "./mixins/CleanupMixin"
import {firstTrue, pointInsideEntity} from "../helpers"

export type BaseThing = Constructor<GameEditAll>
class GameEditAll {
  state: GameStateEditProps
  moving: {entities: Set<Id>; delta: Coors} | null = null
  selectedEntities: Set<Id> = new Set()
  hoveringEntities: Set<Id> = new Set()
  dragSelection: {init: Coors; dragPos: CurrAndPrev} | null = null
  sizableEntity: {
    entity: Entity
    edge: "bottom" | "top" | "left" | "right"
  } | null = null

  private stepFunctions: {fun: (deltaT: number) => void; priority: number}[] =
    []

  protected registerStepFunction(
    fn: (deltaT: number) => void,
    priority?: number
  ) {
    this.stepFunctions.push({fun: fn, priority: priority ?? 0})
    this.stepFunctions.sort((a, b) => (a.priority < b.priority ? -1 : 1))
  }

  constructor(
    public currentLevel: LevelMap,
    public setLevels: (level: Partial<LevelMap>) => void,
    public canvas: HTMLCanvasElement
  ) {
    window.addingEntity.baseColor = currentLevel.platformColor
    const state = levelInfoToEditState(currentLevel)
    addDevEventListeners(state, canvas)
    this.state = state
    const initCoors = JSON.parse(localStorage.getItem("edit-coors") ?? "[0,0]")
    this.state.camera.position = initCoors
  }

  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp)
    const deltaT = this.state.time.deltaT
    updateTimers(this.state.timers, deltaT)
    for (const fn of this.stepFunctions) {
      fn.fun(timeStamp)
    }
  }

  fromId(entity: Id): Entity | undefined {
    return this.state.entities.find((e) => e.id === entity)
  }

  get isMovingCanvas() {
    return (
      this.moving === null &&
      this.state.keys.mouseDown.curr &&
      this.hoveringEntities.size === 0 &&
      !this.dragSelection
    )
  }

  get currentlySelected(): Entity[] {
    return [...this.selectedEntities]
      .map((e) => this.fromId(e))
      .filter(Boolean) as Entity[]
  }

  toRounded(pos: Coors): Coors {
    const roundTo = 10
    const valX = Math.ceil(pos[0] / roundTo) * roundTo
    const valY = Math.ceil(pos[1] / roundTo) * roundTo
    return [valX, valY]
  }

  isEdgeOfEntity = (
    e: Entity,
    pos: Coors
  ): "bottom" | "top" | "left" | "right" | null => {
    if (!pointInsideEntity(e, pos, 10)) return null
    const dist = 4

    return firstTrue({
      right: Math.abs(e.posRight - pos[0]) < dist,
      left: Math.abs(e.posLeft - pos[0]) < dist,
      top: Math.abs(e.posTop - pos[1]) < dist,
      bottom: Math.abs(e.posBottom - pos[1]) < dist
    })
  }
}

export class GameEdit extends RenderMixin(
  CleanupMixin(SaveMixin(MutateEntityMixin(InputMixin(GameEditAll))))
) {}
