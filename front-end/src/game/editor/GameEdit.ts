import {LevelMap} from "../loopShared/models"
import {Coors, CurrAndPrev, Entity, Id} from "../entities/entityTypes"
import {updateTime} from "../state/helpers"
import {updateTimers} from "../state/timeHelpers"
import {
  addEntityToState,
  copyEntity,
  GameStateEditProps,
  levelInfoToEditState
} from "./editHelpers"
import {addDevEventListeners} from "./eventListeners"
import {Platform} from "../entities/platform"
import {RenderMixin} from "./mixins/RenderMixin"
import {MutateEntityMixin} from "./mixins/MutateEntityMixin"
import {InputMixin} from "./mixins/InputMixin"
import {SaveMixin} from "./mixins/SaveMixin"

type GConstructor<T = {}> = new (...args: any[]) => T

export type BaseThing = GConstructor<{
  currentLevel: LevelMap
  setLevels: (level: Partial<LevelMap>) => void
  canvas: HTMLCanvasElement

  state: GameStateEditProps
  movingEntities: Set<Id>
  selectedEntities: Set<Id>
  hoveringEntities: Set<Id>
  dragSelection: {init: Coors; dragPos: CurrAndPrev} | null
  sizableEntity?: {entity: Entity; edge: "bottom" | "top" | "left" | "right"}
  isMovingCanvas: boolean
  fromId: (e: Id) => Entity | undefined
  toRounded: (c: Coors) => Coors
}>

class GameEditAll {
  state: GameStateEditProps
  movingEntities: Set<Id> = new Set()
  selectedEntities: Set<Id> = new Set()
  hoveringEntities: Set<Id> = new Set()
  dragSelection: {init: Coors; dragPos: CurrAndPrev} | null = null
  sizableEntity?: {entity: Entity; edge: "bottom" | "top" | "left" | "right"}

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

  fromId(entity: Id): Entity | undefined {
    return this.state.entities.find((e) => e.id === entity)
  }

  get isMovingCanvas() {
    return (
      this.movingEntities.size === 0 &&
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
  SaveMixin(MutateEntityMixin(InputMixin(GameEditAll)))
) {
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp)

    updateTimers(this.state.timers, this.state.time.deltaT)

    this.updateSave()
    this.updateEntitySelection()
    this.updateEntityMovement()
    this.updateMouseHover()
    this.updateDragSelect()
    this.updateCanvasMovement()

    const mouseDownAction =
      this.state.keys.mouseDown.curr && !this.state.keys.mouseDown.prev

    const startingToGrab = mouseDownAction && !this.state.keys.shift.curr
    const stopGrabbing = !this.state.keys.mouseDown.curr

    if (startingToGrab) {
      if (
        this.state.keys.ctrl.curr === false &&
        this.selectedEntities.intersection(this.hoveringEntities).size === 0
      ) {
        this.selectedEntities.clear() // unselect when not ctrl click
      }

      const last = Array.from(this.hoveringEntities).pop()
      if (last) {
        this.selectedEntities.add(last)
      }

      this.movingEntities = new Set(this.selectedEntities)
    } else if (stopGrabbing) {
      // unselect moving
      this.movingEntities.clear()
      for (const entity of this.state.entities) {
        entity.state.position.curr = this.toRounded([
          ...entity.state.position.curr
        ])
      }
    }

    addEntityToState(this)
    this.updateKeys()
    this.handleStateCleanup()
  }

  updateKeys() {
    Object.values(this.state.keys).forEach((obj) => {
      if (typeof obj.curr === "boolean") {
        obj.prev = obj.curr
      } else {
        if (obj.curr === null) {
          obj.prev = obj.curr
        } else {
          obj.prev = [...obj.curr]
        }
      }
    })
  }

  handleStateCleanup() {
    if (this.state.entities.some((e) => e.state.dead)) {
      this.state.entities = this.state.entities.filter((e) => !e.state.dead)
    }

    if (this.state.keys.delete.curr && this.state.keys.mousePos.curr) {
      this.state.entities = this.state.entities.filter((e) => {
        return !this.selectedEntities.has(e.id)
      })
      this.state.keys.delete.curr = false
    }
    const mouseUpAction =
      this.state.keys.mouseUp.curr && !this.state.keys.mouseUp.prev
    if (mouseUpAction) {
      // lock rounded into place.
      this.state.entities.forEach((e) => {
        e.state.position.curr = this.toRounded(e.state.position.curr)
      })
    }

    if (this.state.keys.copy.curr) {
      this.currentlySelected.forEach((e) => {
        const newE = copyEntity(e)
        if (newE) {
          this.state.entities.push(newE)
          this.selectedEntities.delete(e.id)
          this.selectedEntities.add(newE.id)
        }
      })
      this.state.keys.copy.curr = false
    }

    this.state.keys.mouseUp.curr = null
    this.state.endPosition =
      this.state.entities.find((e) => e.typeId === "endGate")?.state?.position
        ?.curr?.[0] ?? 4500

    // reconcile colors
    const bc = window.addingEntity.baseColor
    if (bc && bc !== this.state.prevBaseColor) {
      this.state.entities.forEach((e) => {
        if (e instanceof Platform) {
          if (e.state.color === this.state.prevBaseColor) {
            e.state.color = bc
          }
        }
      })
      this.state.prevBaseColor = bc
    }
  }
}
