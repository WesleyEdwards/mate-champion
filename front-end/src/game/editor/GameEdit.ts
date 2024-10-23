import {LevelMap} from "../loopShared/models"
import {Champ} from "../entities/champ"
import {Coors, CurrAndPrev, Entity, Id} from "../entities/entityTypes"
import {renderBg} from "../render/background"
import {accountForPosition} from "../render/helpers"
import {updateTime} from "../state/helpers"
import {updateTimers} from "../state/timeHelpers"
import {
  addEntityToState,
  copyEntity,
  editStateToLevelInfo,
  GameStateEditProps,
  incrementPosition,
  levelInfoToEditState,
  toRounded,
  updateCurrPrevBool,
  updateCurrPrevDragState,
  withCamPosition
} from "./editHelpers"
import {addDevEventListeners} from "./eventListeners"
import {Groog} from "../entities/groog"
import {Platform} from "../entities/platform"
import {areEntitiesTouching, areTouching1, toCurrAndPrev} from "../helpers"

export class GameEdit {
  state: GameStateEditProps
  movingEntities: Set<Id> = new Set()
  selectedEntities: Set<Id> = new Set()
  hoveringEntities: Set<Id> = new Set()
  dragSelection: {init: Coors; dragPos: CurrAndPrev} | null = null

  constructor(
    currentLevel: LevelMap,
    private setLevels: (level: Partial<LevelMap>) => void,
    private canvas: HTMLCanvasElement
  ) {
    window.addingEntity.baseColor = currentLevel.platformColor
    this.state = levelInfoToEditState(currentLevel)
    addDevEventListeners(this, canvas)
    const initCoors = JSON.parse(localStorage.getItem("edit-coors") ?? "[0,0]")
    console.log(initCoors)
    this.state.camera.position = initCoors
  }

  get isMovingCanvas() {
    return (
      this.movingEntities.size === 0 &&
      this.state.keys.mouseDown.curr &&
      this.hoveringEntities.size === 0 &&
      !this.dragSelection
    )
  }

  unselectMoving() {
    this.movingEntities.clear()
    for (const entity of this.state.entities) {
      entity.state.position.curr = toRounded([...entity.state.position.curr])
    }
  }

  updateEntityMovement() {
    if (this.movingEntities.size > 0) {
      if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
        const diff: Coors = [
          this.state.keys.mousePos.curr[0] - this.state.keys.mousePos.prev[0],
          this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1]
        ]
        this.movingEntities.forEach((entity) => {
          const e = this.fromId(entity)
          if (!e) return
          const d: Coors =
            e.typeId === "floor" || e.typeId === "endGate"
              ? [diff[0], 0]
              : [...diff]
          incrementPosition(e.state.position.curr, d)
        })
      }
    }
  }
  updateCanvasMovement() {
    if (!this.isMovingCanvas) return
    if (this.state.keys.mousePos.curr && this.state.keys.mousePos.prev) {
      const diff: Coors = [
        -this.state.keys.mousePos.curr[0] + this.state.keys.mousePos.prev[0],
        this.state.keys.mousePos.curr[1] - this.state.keys.mousePos.prev[1]
      ]
      const proposedPos: Coors = [
        this.state.camera.position[0] + diff[0],
        this.state.camera.position[1] + diff[1]
      ]
      if (proposedPos[0] < -200 || proposedPos[0] > 10_000) {
        diff[0] = 0
      }
      if (proposedPos[1] < 0 || proposedPos[1] > 500) {
        diff[1] = 0
      }
      incrementPosition(this.state.camera.position, diff)
    }
  }

  /** Step */
  step(timeStamp: number) {
    updateTime(this.state.time, timeStamp)

    updateTimers(this.state.timers, this.state.time.deltaT)

    this.updateSave()
    this.updateEntitySelection()
    this.updateEntityMovement()
    this.updateMouseHover()
    this.updateDragSelect()
    this.updateCanvasMovement()
    // const guaranteeMovingCanvas =
    //   this.state.keys.mouseDown.curr && this.state.keys.shift.curr

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
      this.unselectMoving()
    }

    addEntityToState(this)
    this.updateKeys()
    this.handleStateCleanup()
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
        e.state.position.curr = toRounded(e.state.position.curr)
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

    // Fix entities
    this.state.entities.forEach((entity) => {
      if (entity instanceof Groog) {
        // entity.state.facing = entity.state.velocity[0] > 0 ? "right" : "left"
      }
    })

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

  updateKeys() {
    Object.values(this.state.keys).forEach((o) => {
      if (typeof o.curr === "boolean") {
        updateCurrPrevBool(o)
      } else {
        updateCurrPrevDragState(o as any)
      }
    })
  }

  updateDragSelect() {
    const justStartedDragSelecting =
      this.state.keys.shift.curr &&
      this.state.keys.mouseDown.prev === false &&
      this.state.keys.mouseDown.curr === true

    if (!this.state.keys.mousePos.curr) {
      return
    }
    const mp = withCamPosition(this.state.keys.mousePos.curr, this.state.camera)

    if (justStartedDragSelecting) {
      this.dragSelection = {init: [...mp], dragPos: toCurrAndPrev([...mp])}
    }

    if (this.state.keys.mouseUp.curr) {
      this.dragSelection = null
    }

    if (this.dragSelection) {
      const dragPos = this.dragSelection.dragPos
      if (
        dragPos.curr[0] !== dragPos.prev[0] ||
        dragPos.curr[1] !== dragPos.prev[1]
      ) {
        this.selectedEntities.clear()
        for (const entity of this.state.entities) {
          if (
            areEntitiesTouching(entity.state, {
              position: {
                curr: [
                  Math.min(this.dragSelection.init[0], dragPos.curr[0]),
                  Math.min(this.dragSelection.init[1], dragPos.curr[1])
                ]
              },
              dimensions: [
                Math.abs(dragPos.curr[0] - this.dragSelection.init[0]),
                Math.abs(dragPos.curr[1] - this.dragSelection.init[1])
              ]
            })
          ) {
            this.selectedEntities.add(entity.id)
          }
        }
      }
      dragPos.prev = [...dragPos.curr]
      dragPos.curr = [...mp]
    }
  }

  updateEntitySelection() {
    if (!this.state.keys.mousePos.curr) {
      return new Set()
    }
    const mouse = withCamPosition(
      this.state.keys.mousePos.curr,
      this.state.camera
    )
    this.hoveringEntities = new Set(
      this.state.entities
        .filter((e) => {
          const isX =
            e.state.position.curr[0] < mouse[0] &&
            e.state.position.curr[0] + e.state.dimensions[0] > mouse[0]
          const isY =
            e.state.position.curr[1] < mouse[1] &&
            e.state.position.curr[1] + e.state.dimensions[1] > mouse[1]
          return isX && isY
        })
        .map(toId)
    )
  }

  updateSave() {
    if (this.state.timers.sinceLastSave.val > 500) {
      this.state.timers.sinceLastSave.val = 0
      this.setLevels(editStateToLevelInfo(this.state))
      localStorage.setItem(
        "edit-coors",
        JSON.stringify(this.state.camera.position)
      )
    }
  }
  updateMouseHover() {
    if (this.state.keys.ctrl.curr) {
      if (this.hoveringEntities.size > 0) {
        this.canvas.style.cursor = "pointer"
      } else {
        this.canvas.style.cursor = "crosshair"
      }
    } else if (this.hoveringEntities.size > 0 || this.movingEntities.size > 0) {
      this.canvas.style.cursor = "grab"
    } else {
      this.canvas.style.cursor = "auto"
    }

    if (this.dragSelection) return
    const isMovingCanvas =
      // this.movingEntities.size === 0 &&
      this.state.keys.mouseDown.curr && this.hoveringEntities.size === 0
    if (isMovingCanvas) {
      this.canvas.style.cursor = "move"
    }
  }

  fromId(entity: Id): Entity | undefined {
    return this.state.entities.find((e) => e.id === entity)
  }

  get currentlySelected(): Entity[] {
    return [...this.selectedEntities]
      .map((e) => this.fromId(e))
      .filter(Boolean) as Entity[]
  }

  /** Render */
  render(cxt: CanvasRenderingContext2D) {
    const camPos = this.state.camera.position
    cxt.save()
    cxt.translate(-camPos[0], camPos[1])

    renderBg(this.state.camera, cxt)

    for (const entity of this.state.entities) {
      cxt.save()
      accountForPosition(toRounded(entity.state.position.curr), cxt)
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
      accountForPosition(toRounded(this.dragSelection.init), cxt)

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

function toId(entity: Entity) {
  return entity.id
}
