import {addEventListeners} from "./loopShared/eventListeners"
import {LevelMap} from "./loopShared/models"
import {Ammo} from "./entities/Ammo"
import {Coors, CurrAndPrev, GameStateProps} from "./entities/entityTypes"
import {Groog} from "./entities/groog"
import {Floor, Platform} from "./entities/platform"
import {emptyTime} from "./state/timeHelpers"
import {EndGate} from "./entities/endGate"
import {Champ} from "./entities/champ/champ"
import {BaseEntity, Entity} from "./entities/Entity"

export const initGameState = (): GameStateProps => ({
  currStateOfGame: "nextLevel",
  camera: {
    position: [0, 0],
    velocity: [0, 0],
    time: {idleTime: emptyTime("up")}
  },
  time: {
    deltaT: 0,
    prevStamp: performance.now()
  },
  timers: {
    nextLevelTimer: {count: "down", val: gameStateConst.showMessageTime}
  },
  stats: {
    score: {curr: 0, prev: 0},
    lives: {curr: 3, prev: 3},
    level: {curr: 1, prev: 1},
    ammo: {curr: 20, prev: 20}
  },
  entities: [],
  keys: addEventListeners(() => {
    window.pause = !window.pause
  })
})

export const levelToEntities = (level: LevelMap): Entity[] => {
  const entities: Entity[] = []

  level.platforms.forEach((p) => {
    entities.push(
      new Platform({
        color: p.color ?? level.platformColor,
        position: [...p.position],
        dimensions: [...p.dimensions]
      })
    )
  })
  level.floors.forEach((f) => {
    entities.push(new Floor({color: f.color, startX: f.x, width: f.width}))
  })

  level.groog.forEach((g) => {
    entities.push(new Groog(g))
  })

  level.packages.forEach((p) => {
    entities.push(new Ammo([...p]))
  })
  entities.push(new EndGate([level.endPosition, 0]))
  entities.push(new Champ([...level.champInitPos]))
  return entities
}

export function areTouching1(
  objectAPos: Coors,
  where: Coors,
  dist: number
): boolean {
  // For some reason, 'where' was coming in as undefined here (from looping through opponents)
  const distBetween = Math.sqrt(
    Math.pow(objectAPos[0] - (where?.[0] ?? 0), 2) +
      Math.pow(objectAPos[1] - (where?.[1] ?? 0), 2)
  )
  return distBetween < dist
}
export const toCurrAndPrev = (coors: Coors): CurrAndPrev => {
  return {curr: [...coors], prev: [...coors]}
}

export const gameStateConst = {
  showMessageTime: 2000
} as const

export const uiIsDirty = (stats: GameStateProps["stats"]): boolean => {
  return (
    stats.level.curr !== stats.level.prev ||
    stats.lives.curr !== stats.lives.prev ||
    stats.score.curr !== stats.score.prev ||
    stats.ammo.curr !== stats.ammo.prev
  )
}

export const updateStats = (stats: GameStateProps["stats"]) => {
  stats.level.prev = stats.level.curr
  stats.lives.prev = stats.lives.curr
  stats.score.prev = stats.score.curr
  stats.ammo.prev = stats.ammo.curr
}

type PosAndDim = {position: {curr: Coors}; dimensions: Coors}
export const areEntitiesTouching = (
  rect1: PosAndDim,
  rect2: PosAndDim
): boolean =>
  rect1.position.curr[0] < rect2.position.curr[0] + rect2.dimensions[0] &&
  rect1.position.curr[0] + rect1.dimensions[0] > rect2.position.curr[0] &&
  rect1.position.curr[1] < rect2.position.curr[1] + rect2.dimensions[1] &&
  rect1.position.curr[1] + rect1.dimensions[1] > rect2.position.curr[1]

function inlineX(entity: BaseEntity, floor: BaseEntity): boolean {
  const width = entity.width
  const posX = entity.posLeft
  return (
    !(posX + width < floor.posLeft) && !(posX > floor.posLeft + floor.width)
  )
}

function inlineY(entity: BaseEntity, floor: BaseEntity): boolean {
  const height = entity.height
  const posY = entity.posTop
  return (
    !(posY + height < floor.posTop) && !(posY > floor.posTop + floor.height)
  )
}

type CollInfo = {
  x: number | null
  bottom: number | null
  top: number | null
  inline: [boolean, boolean]
}
/**
 * @param entity The entity that may collide with the floor
 * @param floor Floor to check
 * @returns the Y position where the entity should be set. Null if no collision.
 */
export function calcPlatEntityCollision(
  entity: BaseEntity,
  floor: BaseEntity
): CollInfo {
  let info: CollInfo = {
    x: null,
    bottom: null,
    top: null,
    inline: [false, false]
  }

  info.inline = [inlineX(entity, floor), inlineY(entity, floor)]
  if (info.inline[0]) {
    info.top = calcPlatEntityCollisionTop(entity, floor)
    info.bottom = calcPlatEntityCollisionBottom(entity, floor)
  }

  if (info.inline[1]) {
    const left = entityIsLeftOfFloor(entity, floor)
    const right = entityIsRightOfFloor(entity, floor)
    info.x = left ?? right
  }
  return info
}
function calcPlatEntityCollisionTop(
  entity: BaseEntity,
  floor: BaseEntity
): number | null {
  const eHeight = entity.height
  const previous = entity.position.prev[1] + eHeight
  const recent = entity.position.curr[1] + eHeight
  const fPos = floor.position.curr[1]

  if (recent >= fPos && previous <= fPos) return fPos - eHeight
  return null
}
function calcPlatEntityCollisionBottom(
  entity: BaseEntity,
  floor: BaseEntity
): number | null {
  const previous = entity.position.prev[1]
  const recent = entity.position.curr[1]
  const fPos = floor.position.curr[1] + floor.height

  if (recent <= fPos && previous >= fPos) return fPos
  return null
}

function entityIsLeftOfFloor(
  entity: BaseEntity,
  floor: BaseEntity
): number | null {
  const eWidth = entity.width

  const previous = entity.position.prev[0] + eWidth
  const recent = entity.posRight
  const fPos = floor.position.curr[0]

  if (recent >= fPos && previous <= fPos) {
    return fPos - eWidth
  }
  return null
}

function entityIsRightOfFloor(
  entity: BaseEntity,
  floor: BaseEntity
): number | null {
  const previous = entity.position.prev[0]
  const recent = entity.position.curr[0]
  const fPos = floor.posRight

  if (recent <= fPos && previous >= fPos) {
    return fPos
  }
  return null
}

export function pointInsideEntity(
  e: Entity,
  point: Coors,
  distOutsideOfEntityThreshHold?: number
) {
  const dist = distOutsideOfEntityThreshHold ?? 0
  const isX = e.posLeft - dist < point[0] && e.posRight + dist > point[0]
  const isY = e.posTop - dist < point[1] && e.posBottom + dist > point[1]
  return isX && isY
}

export const firstTrue = <T extends string>(
  x: Record<T, boolean>
): T | undefined => {
  return Object.entries(x).find(([_, value]) => value)?.[0]
}
