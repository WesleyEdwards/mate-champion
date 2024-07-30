import { generateRandomInt, randomOutOf } from "../../Game/helpers/utils";
import { Coordinates } from "../../Game/models";
import { MBulletState } from "../bullet";
import { Coors, GameStateProps } from "../entityTypes";
import { GroogState } from "../groog";
import { Timer, updatePosAndVel, updateTimers } from "./timeHelpers";

export const emptyCoors = (): Coordinates => ({ x: 0, y: 0 });

export const distBetween = (a: Coors, b: Coors) =>
  Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));

export const updateTime = (time: GameStateProps["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp;
  time.deltaT = elapsed;
  time.prevStamp = timeStamp;
};

// export type EntityOld<
//   TIMERS extends Record<string, Timer> = Record<never, Timer>
// > = {
//   id: Id;
//   velocity: Coordinates;
//   position: CurrAndPrev;
//   timers: TIMERS;
// };

// export const innitEntity = <T extends Record<string, Timer>>({
//   position,
//   timers,
//   velocity,
// }: {
//   timers: T;
//   position: Coordinates;
//   velocity?: Coordinates;
// }): EntityOld<T> => ({
//   velocity: { ...(velocity ?? emptyCoors()) },
//   position: { prev: { ...position }, curr: { ...position } },
//   timers: { ...timers },
//   id: generateRandomInt(0, 12345),
// });

// export const updateEntities = (
//   builders: EntityUpdate<any>[],
//   gs: GameStateProps
// ) => {
//   for (const builder of builders) {
//     for (const entity of builder.getter(gs)) {
//       updatePosAndVel(entity.position, entity.velocity, gs.time.deltaT);
//       updateTimers(entity.timers, gs.time.deltaT);
//       builder.fun(entity as never, gs.time.deltaT, (e) => gs.toRemove.push(e));
//     }
//   }
// };

// type GenEntity = EntityOld<Record<string, Timer>>;

export type UpdateFun<T> = (entity: T, deltaT: number) => void;

// type EntityUpdate<T extends GenEntity> = {
//   fun: UpdateFun<T>;
//   getter: (gs: GameStateProps) => T[];
// };

// export const updateBuilder = <T extends GenEntity>(e: EntityUpdate<T>) => e;

// export const updateEntity = <T extends EntityOld>(
//   entity: T,
//   deltaT: number
// ) => {
//   // updatePosAndVel(entity.position, entity.velocity, deltaT);
//   updateTimers(entity.timers, deltaT);
// };

export type ToRemove =
  | { type: "bullet"; entity: MBulletState }
  | { type: "groog"; entity: GroogState };

// export const removeZombies = (gs: GameStateProps) => {
//   gs.toRemove.forEach((z) => removeMap[z.type](z, gs));
// };

// const removeMap: Record<
//   ToRemove["type"],
//   (z: ToRemove, gs: GameStateProps) => void
// > = {
//   bullet: (z, gs) => {
//     gs.bullets = gs.bullets.filter((b) => b.id !== z.entity.id);
//   },
//   groog: (z, gs) => {
//     gs.grogs = gs.grogs.filter((g) => g.id !== z.entity.id);
//   },
// };

export type ActionMap<M extends { name: string }, E> = {
  [K in M["name"]]: (entity: E, action: Extract<M, { name: K }>) => void;
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
