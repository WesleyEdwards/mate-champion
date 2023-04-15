import { Bullet } from "../Bullet/Bullet";
import { INCREMENT_VALUE, BULLET_RADIUS } from "../constants";
import { debounceLog } from "../utils";
import {
  HasPosition,
  Keys,
  Character,
  Coordinates,
  StaticObject,
} from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";
import { Package } from "../Bullet/Package";

export function updateWithPlayer<T extends HasPosition>(
  keys: Keys,
  scrollOffset: number,
  player: Player,
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
  if (platform.canMoveBelow && char.vector.isMovingDown) {
    return;
  }
  if (
    char.vector.rightPos < platform.vector.posX ||
    char.vector.posX > platform.vector.posX + platform.vector.width
  ) {
    return;
  }
  const charAbove = char.vector.bottomPos < platform.vector.posY + 1;
  if (!charAbove) return;
  if (
    char.vector.velY > 0 &&
    char.vector.bottomPos < platform.vector.posY + 2 &&
    char.vector.bottomPos > platform.vector.posY - 2
  ) {
    return char.setPosY(platform.vector.posY - char.vector.height - 1);
  }

  const distAboveThreshold = 25 * char.vector.velY;

  if (
    char.vector.velY > 0.3 &&
    char.vector.bottomPos < platform.vector.posY + distAboveThreshold &&
    char.vector.bottomPos > platform.vector.posY - distAboveThreshold
  ) {
    char.setPosY(platform.vector.posY - char.vector.height - 1);
  }
}

export function areTouching<T extends HasPosition>(
  objectA: T,
  where: Coordinates,
  dist: number
): boolean {
  // For some reason, 'where' was coming in as undefined here (from looping through opponents)
  const distBetween = Math.sqrt(
    Math.pow(objectA.vector.posCenter.x - (where?.x ?? 0), 2) +
      Math.pow(objectA.vector.posCenter.y - (where?.y ?? 0), 2)
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
        player.vector.radius + opp.vector.radius + 15
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
          BULLET_RADIUS + opp.vector.radius + 10
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
): Package | undefined {
  return packages.find((p) => {
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

export function addEventListeners(keys: Keys) {
  window.addEventListener("keydown", ({ code }) => {
    if (code === "KeyW" || code === "ArrowUp") keys.up = true;
    if (code === "KeyD" || code === "ArrowRight") keys.right = true;
    if (code === "KeyA" || code === "ArrowLeft") keys.left = true;
    if (code === "KeyS" || code === "ArrowDown") keys.down = true;
    if (code === "Space") keys.jump = true;
    if (code === "KeyJ") keys.shoot = true;
    if (code === "KeyK") keys.shank = true;
  });

  window.addEventListener("keyup", ({ code }) => {
    if (code === "KeyW" || code === "ArrowUp") keys.up = false;
    if (code === "KeyD" || code === "ArrowRight") keys.right = false;
    if (code === "KeyA" || code === "ArrowLeft") keys.left = false;
    if (code === "KeyS" || code === "ArrowDown") keys.down = false;
    if (code === "Space") keys.jump = false;
    if (code === "KeyJ") keys.shoot = false;
    if (code === "KeyK") keys.shank = false;
  });
}
