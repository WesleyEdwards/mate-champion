import { Keys } from "../../Game/models";
import { Champ } from "../champ";

export const updateKeys = (keys: Keys, player: Champ) => {
  if (keys.jump || keys.toJump > 0) {
    player.queueActions.push("Jump");
    player.jump.isJumping = true;
    keys.toJump = 0;
  } else {
    player.jump.isJumping = false;
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
  if (keys.shank) {
    player.queueActions.push("Melee");
  }
};
