import { Bullet } from "../Bullet";
import {
  INCREMENT_VALUE,
  playerConstants,
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
} from "../constants";
import { HasPosition, Keys, Character, Coordinates } from "../models";
import { ObjectManager } from "../ObjectManager/ObjectManager";
import { Opponent } from "../Opponent/Opponent";
import { Platform } from "../Platform";
import Player from "../Player/Player";

export function updateWithPlayer<T extends HasPosition>(
  keys: Keys,
  player: Player,
  scrollOffset: number,
  objects: Array<T[]>
): void {
  const objList = objects.flat();

  if (keys.right && player.vector.velocityX === 0) {
    objList.forEach((object) => {
      object.position.x -= INCREMENT_VALUE;
    });
  }
  if (keys.left && player.vector.velocityX === 0 && scrollOffset > 0) {
    objList.forEach((object) => {
      object.position.x += INCREMENT_VALUE;
    });
  }
}

export function calcPlatColl<T extends Character>(platform: Platform, char: T) {
  if (
    char.vector.bottomPos <= platform.posTop &&
    char.vector.bottomPos + char.vector.velocity.y >= platform.posTop &&
    char.vector.rightPos >= platform.position.x &&
    char.position.x <= platform.rightPos
  ) {
    if (char.vector.isMovingDown) {
      return;
    }
    char.setPosY(platform.posTop - char.vector.height);
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
      areTouching(
        opp,
        player.weaponPosCurr,
        player.vector.radius + opp.vector.radius + 30
      )
    ) {
      shanked.push(opp);
      return;
    }
    bullets.forEach((bullet) => {
      if (
        areTouching(
          opp,
          bullet.posCenter,
          bullet.radius + opp.vector.radius + 10
        )
      ) {
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

export function addEventListeners(keys: Keys) {
  window.addEventListener("keydown", ({ code }) => {
    if (code === "KeyW") keys.up = true;
    if (code === "KeyD") keys.right = true;
    if (code === "KeyA") keys.left = true;
    if (code === "KeyS") keys.down = true;
    if (code === "Space") keys.jump = true;
    if (code === "KeyJ") keys.shoot = true;
    if (code === "KeyK") keys.shank = true;
  });

  window.addEventListener("keyup", ({ code }) => {
    if (code === "KeyW") keys.up = false;
    if (code === "KeyD") keys.right = false;
    if (code === "KeyA") keys.left = false;
    if (code === "KeyS") keys.down = false;
    if (code === "Space") keys.jump = false;
    if (code === "KeyJ") keys.shoot = false;
    if (code === "KeyK") keys.shank = false;
  });
}
