import { Keys } from "../../Game/models";
import { ChampState } from "../entities/champ";

export const updateKeys = (keys: Keys, player: ChampState) => {
  if (keys.jump || keys.toJump > 0) {
    player.acceptQueue.push({ name: "jump" });
    player.jump.isJumping = true;
    keys.toJump = 0;
  } else {
    player.jump.isJumping = false;
  }

  if (keys.right && keys.left) {
    const opposite = keys.mostRecentX === "left" ? "right" : "left";
    player.acceptQueue.push({ name: "moveX", dir: opposite });
  } else if (keys.right) {
    player.acceptQueue.push({ name: "moveX", dir: "right" });
    keys.mostRecentX = "right";
  } else if (keys.left) {
    player.acceptQueue.push({ name: "moveX", dir: "left" });
    keys.mostRecentX = "left";
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
