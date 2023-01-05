import { Bullet } from "../Bullet";
import {
  INCREMENT_VALUE,
  playerConstants,
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
  END_POS,
} from "../constants";
import {
  HasPosition,
  Keys,
  Character,
  Coordinates,
  StaticObject,
} from "../models";
import { ObjectManager } from "./ObjectManager";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";
import { Package } from "../Package";

export function updateWithPlayer<T extends HasPosition>(
  keys: Keys,
  player: Player,
  scrollOffset: number,
  objects: Array<T[]>
): void {
  const objList = objects.flat();

  if (keys.right && player.vector.velX === 0) {
    objList.forEach((object) => {
      object.vector.setPosX(object.vector.posX - INCREMENT_VALUE);
    });
  }
  if (keys.left && player.vector.velX === 0 && scrollOffset > 0) {
    objList.forEach((object) => {
      object.vector.setPosX(object.vector.posX + INCREMENT_VALUE);
    });
  }
}

export function calcPlatColl<T extends Character>(
  platform: StaticObject,
  char: T
) {
  if (
    char.vector.bottomPos <= platform.vector.posY &&
    char.vector.bottomPos + char.vector.velY >= platform.vector.posY &&
    char.vector.rightPos >= platform.vector.posX &&
    char.vector.posX <= platform.vector.posX + platform.vector.width
  ) {
    if (platform.canMoveBelow && char.vector.isMovingDown) {
      return;
    }
    char.setPosY(platform.vector.posY - char.vector.height);
  }
}
export function calcPlatPackageColl(
  platform: StaticObject,
  matePackage: Package
) {
  if (
    matePackage.vector.bottomPos <= platform.vector.posY &&
    matePackage.vector.bottomPos + matePackage.velocity.y >=
      platform.vector.posY &&
    matePackage.vector.rightPos >= platform.vector.posX &&
    matePackage.vector.posX <= platform.vector.posX + platform.vector.width
  ) {
    matePackage.setPosY(platform.vector.posY - matePackage.vector.height);
  }
}

export function checkIfCaught(player: Player, opponents: Character[]): boolean {
  if (player.vector.bottomPos > MAX_CANVAS_HEIGHT - 5) return true;
  return opponents.some((opp) =>
    areTouching(player, opp.vector.posCenter, playerConstants.radius * 2)
  );
}

function areTouching<T extends HasPosition>(
  objectA: T,
  where: Coordinates,
  dist: number
): boolean {
  const distBetween = Math.sqrt(
    Math.pow(objectA.vector.posCenter.x - where.x, 2) +
      Math.pow(objectA.vector.posCenter.y - where.y, 2)
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

export function updatePackageStatus(
  player: Player,
  packages: Package[]
): Package[] {
  return packages.filter((p) => {
    if (
      areTouching(
        player,
        {
          x: p.vector.posCenter.x + 30,
          y: p.vector.posCenter.y,
        },
        40
      )
    ) {
      return true;
    }
    return false;
  });
}

export function drawComponents(
  context: CanvasRenderingContext2D,
  objects: ObjectManager
) {
  const { platforms, opponents, player, pot, bullets, matePackages } = objects;
  context.fillStyle = "white";
  context.fillRect(0, 0, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
  context.fillStyle = "red";
  context.fillRect(-100, MAX_CANVAS_HEIGHT - 5, END_POS + 100, 5);

  platforms.forEach((plat) => plat.draw(context));
  opponents.forEach((opponent) => opponent.draw(context));
  player.draw(context);
  bullets.forEach((bullet) => bullet.draw(context));
  matePackages.forEach((p) => p.draw(context));

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
