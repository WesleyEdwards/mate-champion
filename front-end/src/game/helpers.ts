import { addEventListeners } from "./loopShared/eventListeners";
import { FullLevelInfo } from "./loopShared/models";
import { Ammo } from "./entities/Ammo";
import {
  Coors,
  CurrAndPrev,
  Entity,
  GameStateProps,
} from "./entities/entityTypes";
import { Groog } from "./entities/groog";
import { Floor, floorConst, Platform } from "./entities/platform";
import { emptyTime } from "./state/timeHelpers";

export const initGameState = (): GameStateProps => ({
  currStateOfGame: "nextLevel",
  camera: {
    position: [0, 0],
    velocity: [0, 0],
    time: { idleTime: emptyTime("up") },
  },
  time: {
    deltaT: 0,
    prevStamp: performance.now(),
  },
  timers: {
    nextLevelTimer: { count: "down", val: gameStateConst.showMessageTime },
  },
  stats: {
    score: { curr: 0, prev: 0 },
    lives: { curr: 3, prev: 3 },
    level: { curr: 1, prev: 1 },
    ammo: { curr: 20, prev: 20 },
  },
  entities: [],
  keys: addEventListeners(() => {
    window.pause = !window.pause;
  }),
});

export const levelToEntities = (level: FullLevelInfo): Entity[] => {
  const entities: Entity[] = [];

  level.platforms.forEach((p) => {
    entities.push(
      new Platform({
        color: p.color,
        position: [p.x, p.y],
        dimensions: [p.width, p.height],
      })
    );
  });
  level.floors.forEach((f) => {
    entities.push(new Floor({ color: f.color, startX: f.x, width: f.width }));
  });

  level.opponents.grog.forEach((g) => {
    entities.push(new Groog([g.initPos.x, g.initPos.y], [g.moveSpeed, 0]));
  });

  level.packages.forEach((p) => {
    entities.push(new Ammo([p.x, p.y]));
  });
  return entities;
};

export function areTouching1(
  objectAPos: Coors,
  where: Coors,
  dist: number
): boolean {
  // For some reason, 'where' was coming in as undefined here (from looping through opponents)
  const distBetween = Math.sqrt(
    Math.pow(objectAPos[0] - (where?.[0] ?? 0), 2) +
      Math.pow(objectAPos[1] - (where?.[1] ?? 0), 2)
  );
  return distBetween < dist;
}
export const toCurrAndPrev = (coors: Coors): CurrAndPrev => {
  return { curr: [...coors], prev: [...coors] };
};

export const gameStateConst = {
  showMessageTime: 2000,
} as const;

export const uiIsDirty = (stats: GameStateProps["stats"]): boolean => {
  return (
    stats.level.curr !== stats.level.prev ||
    stats.lives.curr !== stats.lives.prev ||
    stats.score.curr !== stats.score.prev ||
    stats.ammo.curr !== stats.ammo.prev
  );
};

export const updateStats = (stats: GameStateProps["stats"]) => {
  stats.level.prev = stats.level.curr;
  stats.lives.prev = stats.lives.curr;
  stats.score.prev = stats.score.curr;
  stats.ammo.prev = stats.ammo.curr;
};

export const areEntitiesTouching = (
  rect1: Entity["state"],
  rect2: Entity["state"]
): boolean =>
  rect1.position.curr[0] < rect2.position.curr[0] + rect2.dimensions[0] &&
  rect1.position.curr[0] + rect1.dimensions[0] > rect2.position.curr[0] &&
  rect1.position.curr[1] < rect2.position.curr[1] + rect2.dimensions[1] &&
  rect1.position.curr[1] + rect1.dimensions[1] > rect2.position.curr[1];

/**
 * @param entity The entity that may collide with the floor
 * @param floor Floor to check
 * @returns the Y position where the entity should be set. Null if no collision.
 */
export function calcPlatEntityCollision(
  entity: Entity,
  floor: Entity
): number | null {
  const width = entity.state.dimensions[0];
  const posX = entity.state.position.curr[0];
  if (
    posX + width < floor.state.position.curr[0] ||
    posX > floor.state.position.curr[0] + floor.state.dimensions[0]
  ) {
    return null;
  }

  const betweenCenterAndBottom = entity.state.dimensions[1];

  const previous = entity.state.position.prev[1] + betweenCenterAndBottom;
  const recent = entity.state.position.curr[1] + betweenCenterAndBottom;

  if (
    recent >= floor.state.position.curr[1] &&
    previous <= floor.state.position.curr[1]
  ) {
    const setY = floor.state.position.curr[1] - betweenCenterAndBottom;
    entity.state.position.curr[1] = entity.state.position.prev[1];
    return setY;
  }
  return null;
}
