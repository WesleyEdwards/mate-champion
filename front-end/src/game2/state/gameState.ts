import { Coordinates, LevelInfo } from "../../Game/models";
import { GameState1 } from "../State1";
import { Champ } from "../champ";
import { updateFloorsAndPlatforms } from "../floor";
import { processBullets, updateBullet } from "./bullet";
import { updateCamera } from "./camera";
import { updatePlayer } from "./champ/champ";
import { updateGroog } from "./groog";
import {
  removeZombies,
  updateBuilder,
  updateEntities,
  updateTime,
} from "./helpers";
import { updateKeys } from "./keys";

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

  updateEntities(
    [
      updateBuilder({ fun: updatePlayer, getter: (gs) => [gs.player] }),
      updateBuilder({ fun: updateGroog, getter: (gs) => gs.grogs }),
      updateBuilder({ fun: updateBullet, getter: (gs) => gs.bullets }),
    ],
    gs
  );

  processBullets(gs);
  removeZombies(gs);
};
