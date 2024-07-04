import { GameState1 } from "../State1";
import { updateCamera } from "./camera";
import { updatePlayer } from "./champ";
import { updateKeys } from "./keys";

export const updateGs = (gs: GameState1, timeStamp: number, pause: boolean) => {
  if (pause) return;
  updateTime(gs.time, timeStamp);
  updateKeys(gs.keys, gs.player);

  updateCamera(gs.camera, gs.time.deltaT, gs.player);

  updatePlayer(gs.player, gs.time.deltaT);
};

const updateTime = (time: GameState1["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp;
  time.deltaT = elapsed;
  time.prevStamp = timeStamp;
};
