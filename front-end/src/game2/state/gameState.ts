import { LevelInfo } from "../../Game/models";
import { GameState1 } from "../State1";
import { updateFloors } from "../floor";
import { updatePlatforms } from "../platform";
import { updateCamera } from "./camera";
import { updatePlayer } from "./champ/champ";
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

  updateFloors(gs.floors, gs.player);
  updatePlatforms(gs.platforms, gs.player);

  updatePlayer(gs.player, gs.time.deltaT);
};

const updateTime = (time: GameState1["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp;
  time.deltaT = elapsed;
  time.prevStamp = timeStamp;
};
