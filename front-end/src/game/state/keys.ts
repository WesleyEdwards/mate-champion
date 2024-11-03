import {Keys} from "../loopShared/models"
import {Champ} from "../entities/champ/champ"

export const updateKeys = (keys: Keys, player: Champ) => {
  if (keys.jump || keys.toJump > 0) {
    player.state.acceptQueue.push({name: "jump"})
    player.state.jump.isJumping = true
    keys.toJump = 0
  } else {
    player.state.jump.isJumping = false
  }

  if (keys.right && keys.left) {
    const opposite = keys.mostRecentX === "left" ? "right" : "left"
    player.state.acceptQueue.push({name: "moveX", dir: opposite})
  } else if (keys.right) {
    player.state.acceptQueue.push({name: "moveX", dir: "right"})
    keys.mostRecentX = "right"
  } else if (keys.left) {
    player.state.acceptQueue.push({name: "moveX", dir: "left"})
    keys.mostRecentX = "left"
  }

  if (keys.shank) {
    player.state.acceptQueue.push({name: "melee"})
  }
  if (keys.up) {
    player.state.acceptQueue.push({name: "setFacingY", dir: "up"})
  }
  if (keys.down) {
    player.state.acceptQueue.push({name: "setFacingY", dir: "down"})
  }
  if (keys.shoot || keys.toShoot > 0) {
    player.state.acceptQueue.push({name: "shoot"})
    keys.toShoot = 0
  }
}
