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

export type BaseThing = Constructor<GameEditAll>
class GameEditAll {
  state: GameStateEditProps
  moving: {entities: Set<Id>; delta: Coors} | null = null
  selectedEntities: Set<Id> = new Set()
  hoveringEntities: Set<Id> = new Set()
  dragSelection: {init: Coors; dragPos: CurrAndPrev} | null = null
  sizableEntity?: {entity: Entity; edge: "bottom" | "top" | "left" | "right"}

  private stepFunctions: {fun: (deltaT: number) => void; priority: number}[] =
    []

  protected registerStepFunction(
    fn: (deltaT: number) => void,
    priority?: number
  ) {
    this.stepFunctions.push({fun: fn, priority: priority ?? 0})
    this.stepFunctions.sort((a, b) => (a.priority < b.priority ? -1 : 1))
  }

  protected callStepFunctions(deltaT: number) {
    for (const fn of this.stepFunctions) {
      fn.fun(deltaT)
    }
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

    this.registerStepFunction((timeStamp) =>
      updateTime(this.state.time, timeStamp)
    )
    this.registerStepFunction((timeStamp) =>
      updateTimers(this.state.timers, this.state.time.deltaT)
    )
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
}

export class GameEdit extends RenderMixin(
  CleanupMixin(SaveMixin(MutateEntityMixin(InputMixin(GameEditAll))))
) {
  step(timeStamp: number) {
    this.callStepFunctions(timeStamp)
  }
}
