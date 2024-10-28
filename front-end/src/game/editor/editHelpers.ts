import {MAX_CANVAS_HEIGHT, platformConst} from "../loopShared/constants"
import {LevelMap} from "../loopShared/models"
import {
  Camera,
  Coors,
  CurrAndPrev,
  Entity,
  EntityOfType
} from "../entities/entityTypes"
import {levelToEntities, toCurrAndPrev} from "../helpers"
import {Floor, floorConst, Platform} from "../entities/platform"
import {emptyTime, TimerUp} from "../state/timeHelpers"
import {GameEdit} from "./GameEdit"
import {Groog, groogConst} from "../entities/groog"
import {Ammo} from "../entities/Ammo"
import {AddableEntity} from "../../components/GameEdit/CourseBuilderSettings"

export const addEntityToState = (gs: GameEdit) => {
  const shouldAdd =
    gs.state.keys.ctrl.curr &&
    gs.state.keys.mousePos.curr &&
    gs.state.keys.mouseUp.curr &&
    gs.hoveringEntities.size === 0 &&
    gs.movingEntities.size === 0

  if (!shouldAdd) return
  if (!gs.state.keys.mouseUp.curr) return

  const addable: Record<AddableEntity, Entity> = {
    groog: new Groog({
      moveSpeed: 0.3,
      position: [0, 0],
      timeBetweenJump: 2000,
      timeBetweenTurn: 3000
    }),
    floor: new Floor({color: "springgreen", startX: 0, width: 1000}),
    platform: new Platform({
      color: window.addingEntity.baseColor ?? "springgreen",
      position: [0, 0],
      dimensions: [300, platformConst.defaultHeight]
    }),
    ammo: new Ammo([0, 0])
  }

  const toAdd = window.addingEntity.type ?? "platform"

  const entity = addable[toAdd]
  const pos = gs.state.keys.mouseUp.curr

  const center: Coors = [
    pos[0] - entity.state.dimensions[0] / 2,
    pos[1] - entity.state.dimensions[1] / 2
  ]

  entity.state.position = toCurrAndPrev(
    withCamPosition(center, gs.state.camera)
  )

  if (entity.typeId === "floor") {
    // Should probably do this higher up in the fun, but this works for now
    entity.state.position.curr[1] = floorConst.floorY
  }
  gs.state.entities.push(entity)
}

export const copyEntity = (e: Entity): Entity | undefined => {
  if (
    e.typeId === "endGate" ||
    e.typeId === "player" ||
    e.typeId === "floor" ||
    e.typeId === "bullet"
  ) {
    return undefined
  }
  const copyOfWithOffset = (coors: CurrAndPrev): Coors => {
    const correctForY = coors.curr[0] + 80 > MAX_CANVAS_HEIGHT ? -100 : 100
    return [coors.curr[0] + 100, coors.curr[1] + correctForY]
  }

  const map: {
    [K in AddableEntity]: (old: EntityOfType[K]) => EntityOfType[K]
  } = {
    groog: (old) =>
      new Groog({
        moveSpeed: old.state.velocity[0],
        position: copyOfWithOffset(old.state.position),
        timeBetweenJump: old.state.timeBetweenJump,
        timeBetweenTurn: old.state.timeBetweenTurn
      }),
    floor: (old) =>
      new Floor({
        color: old.state.color,
        startX: old.state.position.curr[0],
        width: old.state.dimensions[0]
      }),
    platform: (old) =>
      new Platform({
        color: old.state.color,
        dimensions: [old.state.dimensions[0], old.state.dimensions[1]],
        position: copyOfWithOffset(old.state.position)
      }),
    ammo: (old) => new Ammo(old.state.position.curr)
  }
  return map[e.typeId](e as never)
}

export const toRounded = (pos: Coors): Coors => {
  const roundTo = 10
  const valX = Math.ceil(pos[0] / roundTo) * roundTo
  const valY = Math.ceil(pos[1] / roundTo) * roundTo
  return [valX, valY]
}

export const incrementPosition = (curr: Coors, increment: Coors) => {
  curr[0] += increment[0]
  curr[1] += increment[1]
}

export const withCamPosition = (curr: Coors, cam: Camera): Coors => {
  return [curr[0] + cam.position[0], curr[1] - cam.position[1]]
}

export type EventState = {prev: boolean; curr: boolean}
export type DragState = {prev: Coors | null; curr: Coors | null}

export type GameStateEditProps = {
  entities: Entity[]
  prevBaseColor: string
  endPosition: number
  camera: Camera
  time: {
    deltaT: number
    prevStamp: number
  }
  timers: {
    sinceLastSave: TimerUp
  }
  keys: {
    shift: EventState
    ctrl: EventState
    delete: EventState
    mouseDown: EventState
    copy: EventState
    mouseUp: DragState
    mousePos: DragState
  }
}

export const updateCurrPrevBool = (obj: {curr: boolean; prev: boolean}) => {
  obj.prev = obj.curr
}

export const updateCurrPrevDragState = (obj: {
  curr: Coors | null
  prev: Coors | null
}) => {
  if (obj.curr === null) {
    obj.prev = obj.curr
  } else {
    obj.prev = [...obj.curr]
  }
}

export const levelInfoToEditState = (level: LevelMap): GameStateEditProps => ({
  entities: levelToEntities({...level}),
  prevBaseColor: level.platformColor,
  camera: {
    time: {
      idleTime: emptyTime("up")
    },
    position: [0, 0],
    velocity: [0, 0]
  },
  time: {
    deltaT: 0,
    prevStamp: performance.now()
  },
  timers: {
    sinceLastSave: emptyTime("up")
  },
  keys: {
    shift: {prev: false, curr: false},
    ctrl: {prev: false, curr: false},
    delete: {prev: false, curr: false},
    copy: {prev: false, curr: false},
    mouseDown: {prev: false, curr: false},
    mouseUp: {prev: null, curr: null},
    mousePos: {prev: null, curr: null}
  },
  endPosition: level.endPosition
})

export const editStateToLevelInfo = (
  gs: GameStateEditProps
): Partial<LevelMap> => ({
  endPosition: gs.endPosition,
  champInitPos: gs.entities.find((e) => e.typeId === "player")?.state?.position
    ?.curr ?? [400, 400],
  floors: gs.entities
    .filter((e) => e.typeId === "floor")
    .map((f) => ({
      x: f.state.position.curr[0],
      width: f.state.dimensions[0],
      color: (f as Floor).state.color
    })),
  platformColor: gs.prevBaseColor,
  platforms: gs.entities
    .filter((e) => e.typeId === "platform")
    .map((f) => ({
      position: [...f.state.position.curr],
      dimensions: [...f.state.dimensions],
      color: (f as Platform).state.color
    })),
  groog: gs.entities
    .filter((e) => e.typeId === "groog")
    .map((g) => ({
      position: [...g.state.position.curr],
      moveSpeed: (g as Groog).state.velocity[0],
      timeBetweenJump: (g as Groog).state.timeBetweenJump,
      timeBetweenTurn: (g as Groog).state.timeBetweenTurn,
    })),
  packages: gs.entities
    .filter((e) => e.typeId === "ammo")
    .map((p) => [...p.state.position.curr])
})
