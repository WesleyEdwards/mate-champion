import {LevelMap} from "../loopShared/models"
import {Coors, CurrAndPrev, Constructor, Id} from "../entities/entityTypes"
import {updateTime} from "../state/helpers"
import {updateTimers} from "../state/timeHelpers"
import {
  emptyUserInput,
  GameStateEditProps,
  levelInfoToEditState,
  ResizeEntity,
  UserInput
} from "./editHelpers"
import {addDevEventListeners} from "./eventListeners"
import {RenderMixin} from "./mixins/RenderMixin"
import {MutateEntityMixin} from "./mixins/MutateEntityMixin"
import {InputMixin} from "./mixins/InputMixin"
import {SaveMixin} from "./mixins/SaveMixin"
import {Entity} from "../entities/Entity"
import {CleanupMixin} from "./mixins/CleanupMixin"
import {levelToEntities} from "../helpers"
import {CommandStackMixin} from "./CommandMixin"
import {CameraMixin} from "./mixins/CameraMixin"

export type BaseThing = Constructor<GameEditAll>

export class GameEditAll {
  entities: Entity[]
  state: GameStateEditProps
  userInput: UserInput
  moving: {entities: Set<Id>; delta: Coors} | null = null
  selectedEntities: Set<Id> = new Set()
  hoveringEntities: Set<Id> = new Set()
  dragSelection: {init: Coors; dragPos: CurrAndPrev} | null = null
  sizableEntity: ResizeEntity | null = null

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
    this.entities = levelToEntities({...currentLevel})
    const state = levelInfoToEditState(currentLevel)
    const userInput = emptyUserInput()
    addDevEventListeners(userInput, canvas)
    this.userInput = userInput
    this.state = state
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
    return this.entities.find((e) => e.id === entity)
  }

  get currentlySelected(): Entity[] {
    return [...this.selectedEntities]
      .map((e) => this.fromId(e))
      .filter(Boolean) as Entity[]
  }

  justPutMouseDown = () => {
    return !this.userInput.mouseDown.prev && this.userInput.mouseDown.curr
  }
}

export class GameEdit extends RenderMixin(
  CleanupMixin(
    SaveMixin(
      MutateEntityMixin(InputMixin(CameraMixin(CommandStackMixin(GameEditAll))))
    )
  )
) {}

export type GameEditConstructor = Constructor<GameEditAll>

export type WithEvents = Constructor<
  GameEditAll & InstanceType<ReturnType<typeof CommandStackMixin>>
>
export type WithCamera = Constructor<
  GameEditAll & InstanceType<ReturnType<typeof CameraMixin>>
>
