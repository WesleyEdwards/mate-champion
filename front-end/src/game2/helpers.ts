import { addEventListeners } from "../Game/helpers/eventListeners";
import { FullLevelInfo } from "../Game/models";
import { Champ1 } from "./champ";
import { Coors, Entity, GameStateProps } from "./entityTypes";
import { floorConst } from "./floor";
import { Groog1 } from "./groog";
import { Floor1, Platform1 } from "./platform";
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
    console.log("Paused", window.pause);
  }),
});

export const levelToEntities = (level: FullLevelInfo): Entity[] => {
  const entities: Entity[] = [];

  level.platforms.forEach((p) => {
    entities.push(
      new Platform1({
        color: p.color,
        position: { curr: [p.x, p.y], prev: [p.x, p.y] },
        dimensions: [p.width, p.height],
        dead: false,
      })
    );
  });
  level.floors.forEach((f) => {
    entities.push(
      new Floor1({
        color: f.color,
        position: {
          curr: [f.x, floorConst.floorY],
          prev: [f.x, floorConst.floorY],
        },
        dimensions: [f.width, floorConst.floorHeight],
        dead: false,
      })
    );
  });

  level.opponents.grog.forEach((g) => {
    entities.push(new Groog1([g.initPos.x, g.initPos.y], [g.moveSpeed, 0]));
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
