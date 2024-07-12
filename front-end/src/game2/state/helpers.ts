import { generateRandomInt, randomOutOf } from "../../Game/helpers/utils";
import { Coordinates } from "../../Game/models";
import { MBullet } from "../bullet";
import { Groog } from "../groog";
import { GameState1 } from "../State1";
import { Timer, updatePosAndVel, updateTimers } from "./timeHelpers";

export type CurrAndPrev = {
  prev: Coordinates;
  curr: Coordinates;
};

export const emptyCoors = (): Coordinates => ({ x: 0, y: 0 });

export const distBetween = (a: Coordinates, b: Coordinates) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const updateTime = (time: GameState1["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp;
  time.deltaT = elapsed;
  time.prevStamp = timeStamp;
};

export type Id = number;

export type Entity<
  TIMERS extends Record<string, Timer> = Record<never, Timer>
> = {
  id: Id;
  velocity: Coordinates;
  position: CurrAndPrev;
  timers: TIMERS;
};

export const innitEntity = <T extends Record<string, Timer>>({
  position,
  timers,
  velocity,
}: {
  timers: T;
  position: Coordinates;
  velocity?: Coordinates;
}): Entity<T> => ({
  velocity: { ...(velocity ?? emptyCoors()) },
  position: { prev: { ...position }, curr: { ...position } },
  timers: { ...timers },
  id: generateRandomInt(0, 12345),
});

export const updateEntities = (
  builders: EntityUpdate<any>[],
  gs: GameState1
) => {
  for (const builder of builders) {
    for (const entity of builder.getter(gs)) {
      updatePosAndVel(entity.position, entity.velocity, gs.time.deltaT);
      updateTimers(entity.timers, gs.time.deltaT);
      builder.fun(entity as never, gs.time.deltaT, (e) => gs.toRemove.push(e));
    }
  }
};

type GenEntity = Entity<Record<string, Timer>>;

export type UpdateFun<T> = (
  entity: T,
  deltaT: number,
  remove: (e: ToRemove) => void
) => void;

type EntityUpdate<T extends GenEntity> = {
  fun: UpdateFun<T>;
  getter: (gs: GameState1) => T[];
};

export const updateBuilder = <T extends GenEntity>(e: EntityUpdate<T>) => e;

export const updateEntity = <T extends Entity>(entity: T, deltaT: number) => {
  updatePosAndVel(entity.position, entity.velocity, deltaT);
  updateTimers(entity.timers, deltaT);
};

export type ToRemove =
  | { type: "bullet"; entity: MBullet }
  | { type: "groog"; entity: Groog };

export const removeZombies = (gs: GameState1) => {
  gs.toRemove.forEach((z) => removeMap[z.type](z, gs));
};

const removeMap: Record<
  ToRemove["type"],
  (z: ToRemove, gs: GameState1) => void
> = {
  bullet: (z, gs) => {
    gs.bullets = gs.bullets.filter((b) => b.id !== z.entity.id);
  },
  groog: (z, gs) => {
    gs.grogs = gs.grogs.filter((g) => g.id !== z.entity.id);
  },
};

// export const removeEntity = <T extends GameEntityStr>(
//   type: T,
//   entity: GameEntity<T>,
//   gs: GameState1
// ) => {
//   const map: {
//     [K in GameEntityStr]: (entity: GameEntity<K>) => void;
//   } = {
//     bullet: (entity) => {
//       gs.bullets = gs.bullets.filter((b) => b.id !== entity.id);
//     },
//     groog: (entity) => {
//       gs.grogs = gs.grogs.filter((b) => b.id !== entity.id);
//     },
//   };

//   map[type](entity as never);
// };
