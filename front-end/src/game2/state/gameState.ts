import { Keys } from "../../Game/models";
import { GameState1 } from "../State1";
import { PlayerState } from "../champ";
import { updatePlayer } from "./champ";

export const updateGs = (gs: GameState1, timeStamp: number, pause: boolean) => {
  if (pause) return;
  updateTime(gs.time, timeStamp);
  updateKeys(gs.keys, gs.player);
  updatePlayer(gs.player, gs.time.deltaT);
};

const updateTime = (time: GameState1["time"], timeStamp: number) => {
  const elapsed = timeStamp - time.prevStamp;
  time.deltaT = elapsed;
  time.prevStamp = timeStamp;
};

const updateKeys = (keys: Keys, player: PlayerState) => {
  if (keys.jump || keys.toJump > 0) {
    player.queueActions.push("Jump");
    keys.toJump = 0;
  }
  if (keys.down) {
    player.queueActions.push("Duck");
  }
  if (keys.right) {
    player.queueActions.push("MoveRight");
  }
  if (keys.left) {
    player.queueActions.push("MoveLeft");
  }

  // if (keys.right) this.move("MoveRight");
};
