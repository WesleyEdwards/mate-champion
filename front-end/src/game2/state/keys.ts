import { Keys } from "../../Game/models";
import { Champ } from "../champ";

export const updateKeys = (keys: Keys, player: Champ) => {
  if (keys.jump || keys.toJump > 0) {
    player.queueActions.push({ name: "jump" });
    player.jump.isJumping = true;
    keys.toJump = 0;
  } else {
    player.jump.isJumping = false;
  }

  if (keys.right) {
    player.queueActions.push({ name: "moveX", dir: "right" });
  }
  if (keys.left) {
    player.queueActions.push({ name: "moveX", dir: "left" });
  }
  if (keys.shank) {
    player.queueActions.push({ name: "melee" });
  }
  if (keys.up) {
    player.queueActions.push({ name: "setFacingY", dir: "up" });
  }
  if (keys.down) {
    player.queueActions.push({ name: "setFacingY", dir: "down" });
  }
};
