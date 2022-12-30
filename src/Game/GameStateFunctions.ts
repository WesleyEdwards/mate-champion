import { Bullet } from "./Bullet";
import {
  INCREMENT_VALUE,
  playerConstants,
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
} from "./constants";
import { HasPosition, Keys, Character, Coordinates } from "./models";
import { ObjectManager } from "./ObjectManager/ObjectManager";
import { Opponent } from "./Opponent/Opponent";
import { Platform } from "./Platform";
import Player from "./Player/Player";

export function updateWithPlayer<T extends HasPosition>(
  keys: Keys,
  player: Player,
  scrollOffset: number,
  objects: Array<T[]>
): void {
  const objList = objects.flat();

  if (keys.right && player.velocity.x === 0) {
    objList.forEach((object) => {
      object.position.x -= INCREMENT_VALUE;
    });
  }
  if (keys.left && player.velocity.x === 0 && scrollOffset > 0) {
    objList.forEach((object) => {
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
  return opponents.some((opp) =>
    areTouching(player, opp.posCenter, playerConstants.radius * 2)
  );
}

function areTouching<T extends HasPosition>(
  objectA: T,
  where: Coordinates,
  dist: number
): boolean {
  const distBetween = Math.sqrt(
    Math.pow(objectA.posCenter.x - where.x, 2) +
      Math.pow(objectA.posCenter.y - where.y, 2)
  );
  return distBetween < dist;
}

interface LiveStatus {
  opponents: Opponent[];
  bullets: Bullet[];
}

export function updateLiveStatus(
  player: Player,
  opponents: Opponent[],
  bullets: Bullet[]
): LiveStatus {
  const shanked: Opponent[] = [];
  const spentBullets: Bullet[] = [];

  opponents.forEach((opp) => {
    if (
      player.weaponPosCurr &&
      areTouching(opp, player.weaponPosCurr, player.radius + opp.radius + 30)
    ) {
      shanked.push(opp);
      return;
    }
    bullets.forEach((bullet) => {
      if (areTouching(opp, bullet.posCenter, bullet.radius + opp.radius + 10)) {
        shanked.push(opp);
        spentBullets.push(bullet);
      }
    });
  });

  return { opponents: shanked, bullets: spentBullets };
}

export function drawComponents(
  context: CanvasRenderingContext2D,
  objects: ObjectManager
) {
  const { platforms, opponents, player, pot, bullets } = objects;
  context.fillStyle = "white";
  context.fillRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);

  platforms.forEach((plat) => plat.draw(context));
  opponents.forEach((opponent) => opponent.draw(context));
  player.draw(context);
  bullets.forEach((bullet) => bullet.draw(context));

  pot.draw(context);
}
