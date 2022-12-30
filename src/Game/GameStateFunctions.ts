import {
  INCREMENT_VALUE,
  playerConstants,
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
} from "./constants";
import { hasPosition, Keys, Character } from "./models";
import { Opponent } from "./Opponent/Opponent";
import { Platform } from "./Platform";
import Player from "./Player/Player";
import { Pot } from "./Pot";

export function updateWithPlayer<T extends hasPosition>(
  keys: Keys,
  player: Player,
  scrollOffset: number,
  objects: T[]
): void {
  if (keys.right && player.velocity.x === 0) {
    objects.forEach((object) => {
      object.position.x -= INCREMENT_VALUE;
    });
  }
  if (keys.left && player.velocity.x === 0 && scrollOffset > 0) {
    objects.forEach((object) => {
      object.position.x += INCREMENT_VALUE;
    });
  }
}

export function calcPlatColl<T extends Character>(platform: Platform, char: T) {
  if (
    char.bottomPos <= platform.position.y &&
    char.bottomPos + char.velocity.y >= platform.position.y &&
    char.rightPos >= platform.position.x &&
    char.position.x <= platform.rightPos
  ) {
    char.move("StopY");
    char.position.y = platform.position.y - char.height;
  }
}

export function checkIfCaught(player: Player, opponents: Character[]): boolean {
  return opponents.some((opp) => {
    const distBetween = Math.sqrt(
      Math.pow(opp.position.x - player.position.x, 2) +
        Math.pow(opp.position.y - player.position.y, 2)
    );
    if (distBetween < playerConstants.radius * 2) {
      return true;
    }
    return false;
  });
}

function knifeStatus(player: Player, opp: Opponent) {
  if (!player.shanking) return false;
  if (player.facing === "right" && player.position.x < opp.position.x)
    return true;
  if (player.facing === "left" && player.position.x > opp.position.x)
    return true;

  return false;
}

export function updateLiveStatus(
  player: Player,
  opponents: Opponent[]
): Opponent | undefined {
  return opponents.find((opp) => {
    const distBetween = Math.sqrt(
      Math.pow(opp.position.x - player.position.x, 2) +
        Math.pow(opp.position.y - player.position.y, 2)
    );
    if (distBetween < playerConstants.radius * 4 && knifeStatus(player, opp)) {
      return opp;
    }
    return undefined;
  });
}

export function drawComponents(
  context: CanvasRenderingContext2D,
  platforms: Platform[],
  opponents: Opponent[],
  player: Player,
  pot: Pot
) {
  context.fillStyle = "white";
  context.fillRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);

  platforms.forEach((plat) => plat.draw(context));
  opponents.forEach((opponent) => opponent.draw(context));
  player.draw(context);

  pot.draw(context);
}
