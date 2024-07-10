import { Keys } from "../../Game/models";
import { Champ } from "../champ";

export const updateKeys = (keys: Keys, player: Champ) => {
  if (keys.jump || keys.toJump > 0) {
    player.acceptQueue.push({ name: "jump" });
    player.jump.isJumping = true;
    keys.toJump = 0;
  } else {
    player.jump.isJumping = false;
  }

  if (keys.right) {
    player.acceptQueue.push({ name: "moveX", dir: "right" });
  }
  if (keys.left) {
    player.acceptQueue.push({ name: "moveX", dir: "left" });
  }
  if (keys.shank) {
    player.acceptQueue.push({ name: "melee" });
  }
  if (keys.up) {
    player.acceptQueue.push({ name: "setFacingY", dir: "up" });
  }
  if (keys.down) {
    player.acceptQueue.push({ name: "setFacingY", dir: "down" });
  }
  if (keys.shoot || keys.toShoot > 0) {
    player.acceptQueue.push({ name: "shoot" });
    keys.toShoot = 0;
  }
};
