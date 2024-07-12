import { Coordinates, LevelInfo } from "../../Game/models";
import { GameState1 } from "../State1";
import { MBullet } from "../bullet";
import { Champ } from "../champ";
import { updateFloorsAndPlatforms } from "../floor";
import { Groog } from "../groog";
import { processBullets, updateBullet } from "./bullet";
import { updateCamera } from "./camera";
import { updatePlayer } from "./champ/champ";
import { updateGroog } from "./groog";
import { CurrAndPrev, Entity } from "./helpers";
import { updateKeys } from "./keys";
import { Timer, updatePosAndVel, updateTimers } from "./timeHelpers";

export const updateGs = (
  gs: GameState1,
  timeStamp: number,
  pause: boolean,
  levels: LevelInfo[]
) => {
  if (pause) return;
  updateTime(gs.time, timeStamp);
  updateKeys(gs.keys, gs.player);

  updateCamera(gs.camera, gs.time.deltaT, gs.player);

  updateFloorsAndPlatforms(gs.floors, gs.platforms, gs.player, gs.grogs);

  const buildEntities = [
    updateEntityBuilder({ fun: updatePlayer, getter: (gs) => [gs.player] }),
    updateEntityBuilder({ fun: updateGroog, getter: (gs) => gs.grogs }),
    updateEntityBuilder({ fun: updateBullet, getter: (gs) => gs.bullets }),
  ];

  for (const b of buildEntities) {
    for (const a of b.getter(gs)) {
      updatePosAndVel(a.position, a.velocity, gs.time.deltaT);
      updateTimers(a.timers, gs.time.deltaT);
      b.fun(a as never, gs.time.deltaT)
    }
  }

  // updateEntity

  processBullets(gs);
};

// type EntityUpdateList = (EntityUpdate<Champ> | EntityUpdate<Groog>)[];

type GenEntity = Entity<Record<string, Timer>>;

type EntityUpdate<T extends GenEntity> = {
  fun: (e: T, deltaT: number) => void;
  getter: (gs: GameState1) => T[];
};

const updateEntityBuilder = <T extends Entity<Record<string, Timer>>>(
  e: EntityUpdate<T>
) => e;

const updateTime = (time: GameState1["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp;
  time.deltaT = elapsed;
  time.prevStamp = timeStamp;
};

// type ExtractGeneric<Type> = Type extends Array<infer U>
//   ? U
//   : Type extends Promise<infer U>
//   ? U
//   : Type extends Set<infer U>
//   ? U
//   : Type extends Map<infer K, infer V>
//   ? [K, V]
//   : Type extends (...args: any) => infer R
//   ? R
//   : never;
