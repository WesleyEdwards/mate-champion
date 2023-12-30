import { Bullet } from "../Bullet/Bullet";
import {
  HasPosition,
  Keys,
  Character,
  Coordinates,
  StaticObject,
} from "../models";
import Player from "../Player/Player";
import { Package } from "../Bullet/Package";
import { bulletConst } from "../constants";
import { Opponents } from "../Opponent/OpponentManager";
import { Grog } from "../Opponent/Grog";

export function calcPlatOppCollision(platform: StaticObject, opp: Grog) {
  const betweenCenterAndEdgeX = opp.vector.width / 2;
  if (
    opp.vector.position.x + betweenCenterAndEdgeX <
      platform.vector.position.x ||
    opp.vector.position.x - betweenCenterAndEdgeX >
      platform.vector.position.x + platform.vector.width
  ) {
    return;
  }

  const betweenCenterAndBottom = opp.vector.height / 2;

  const previous = opp.vector.prevPosY + betweenCenterAndBottom;
  const recent = opp.vector.position.y + betweenCenterAndBottom;
  if (
    recent >= platform.vector.position.y &&
    previous <= platform.vector.position.y
  ) {
    opp.setOnPlatform(platform.vector.position.y - betweenCenterAndBottom);
  }
}

export function calcPlatPlayerCollision(platform: StaticObject, champ: Player) {
  if (!platform.isFloor && champ.vector.facingY === "down") {
    return;
  }
  const betweenCenterAndEdgeX = champ.vector.width / 2;
  if (
    champ.vector.position.x + betweenCenterAndEdgeX <
      platform.vector.position.x ||
    champ.vector.position.x - betweenCenterAndEdgeX >
      platform.vector.position.x + platform.vector.width
  ) {
    return;
  }

  const betweenCenterAndBottom = champ.vector.height / 2;

  const previous = champ.vector.prevPosY + betweenCenterAndBottom;
  const recent = champ.vector.position.y + betweenCenterAndBottom;
  if (
    recent >= platform.vector.position.y &&
    previous <= platform.vector.position.y
  ) {
    champ.setOnPlatform(platform.vector.position.y - betweenCenterAndBottom);
  }
}

export function areTouching(
  objectAPos: Coordinates,
  where: Coordinates,
  dist: number
): boolean {
  // For some reason, 'where' was coming in as undefined here (from looping through opponents)
  const distBetween = Math.sqrt(
    Math.pow(objectAPos.x - (where?.x ?? 0), 2) +
      Math.pow(objectAPos.y - (where?.y ?? 0), 2)
  );
  return distBetween < dist;
}

export function updateLiveStatus(
  player: Player,
  opponents: Opponents,
  bullets: Bullet[]
): {
  opponents: { grog: number[] };
  bullets: number[];
} {
  const shankedGrogs: number[] = [];
  const spentBulletsIndex: number[] = [];

  opponents.grog.forEach((opp, grogI) => {
    if (
      player.weaponPosCurr &&
      areTouching(
        opp.vector.position,
        player.weaponPosCurr,
        player.vector.radius + opp.vector.radius + 15
      )
    ) {
      shankedGrogs.push(grogI);
      return;
    }
    bullets.forEach((bullet, i) => {
      if (
        areTouching(
          opp.vector.position,
          bullet.position,
          bulletConst.distFromOppHit
        )
      ) {
        shankedGrogs.push(grogI);
        spentBulletsIndex.push(i);
      }
    });
  });

  return {
    opponents: { grog: [...new Set(shankedGrogs)] },
    bullets: [...new Set(spentBulletsIndex)],
  };
}

export function updatePackageStatus(
  player: Player,
  packages: Package[]
): Package | undefined {
  return packages.find((pack) => {
    if (
      areTouching(
        player.vector.position,
        {
          x: pack.vector.position.x,
          y: pack.vector.position.y,
        },
        40
      )
    ) {
      return true;
    }
    return false;
  });
}
