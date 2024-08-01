// import {
//   HasPosition,
//   Keys,
//   Character,
//   Coordinates,
//   StaticObject,
// } from "../models";
// import Player from "../Player/Player";
// import { bulletConst, grogConst, playerConst } from "../constants";
// import { Opponents } from "../Opponent/OpponentManager";
// import { Grog } from "../Opponent/Grog";

// export function calcPlatOppCollision(platform: StaticObject, opp: Grog) {
//   const betweenCenterAndEdgeX = opp.vector.width / 2;
//   if (
//     opp.vector.position.x + betweenCenterAndEdgeX <
//       platform.vector.position.x ||
//     opp.vector.position.x - betweenCenterAndEdgeX >
//       platform.vector.position.x + platform.vector.width
//   ) {
//     return;
//   }

//   const betweenCenterAndBottom = opp.vector.height / 2;

//   const previous = opp.vector.prevPosY + betweenCenterAndBottom;
//   const recent = opp.vector.position.y + betweenCenterAndBottom;
//   if (
//     recent >= platform.vector.position.y &&
//     previous <= platform.vector.position.y
//   ) {
//     opp.setOnPlatform(platform.vector.position.y - betweenCenterAndBottom);
//   }
// }

// export function calcPlatPlayerCollision(platform: StaticObject, champ: Player) {
//   // if (!platform.isFloor && champ.vector.facingY === "down") {
//   //   return;
//   // }
//   // const betweenCenterAndEdgeX = champ.vector.width / 2;
//   // if (
//   //   champ.vector.position.x + betweenCenterAndEdgeX <
//   //     platform.vector.position.x ||
//   //   champ.vector.position.x - betweenCenterAndEdgeX >
//   //     platform.vector.position.x + platform.vector.width
//   // ) {
//   //   return;
//   // }
//   // const betweenCenterAndBottom = champ.vector.height / 2;
//   // const previous = champ.vector.prevPosY + betweenCenterAndBottom;
//   // const recent = champ.vector.position.y + betweenCenterAndBottom;
//   // if (
//   //   recent >= platform.vector.position.y &&
//   //   previous <= platform.vector.position.y
//   // ) {
//   //   champ.setOnPlatform(platform.vector.position.y - betweenCenterAndBottom);
//   // }
// }

// export function areTouching(
//   objectAPos: Coordinates,
//   where: Coordinates,
//   dist: number
// ): boolean {
//   // For some reason, 'where' was coming in as undefined here (from looping through opponents)
//   const distBetween = Math.sqrt(
//     Math.pow(objectAPos.x - (where?.x ?? 0), 2) +
//       Math.pow(objectAPos.y - (where?.y ?? 0), 2)
//   );
//   return distBetween < dist;
// }

// function isBeingHit(opp: Coordinates, player: Player): boolean {
//   if (!player.weaponPosCurr) return false;
//   const hitPos = player.weaponPosCurr;
//   const playerPos = player.vector.position;

//   const halfway = {
//     x: (hitPos.x - playerPos.x) * 0.65 + playerPos.x,
//     y: (hitPos.y - playerPos.y) * 0.65 + playerPos.y,
//   };
//   return areTouching(opp, hitPos, 40) || areTouching(opp, halfway, 40);
// }

// export function updateLiveStatus(
//   player: Player,
//   opponents: Opponents,
//   bullets: Bullet[]
// ): {
//   opponents: { grog: number[] };
//   bullets: number[];
// } {
//   const shankedGrogs: number[] = [];
//   const spentBulletsIndex: number[] = [];

//   opponents.grog.forEach((opp, grogI) => {
//     if (player.weaponPosCurr && isBeingHit(opp.vector.position, player)) {
//       shankedGrogs.push(grogI);
//       return;
//     }
//     bullets.forEach((bullet, i) => {
//       if (
//         areTouching(
//           opp.vector.position,
//           bullet.position,
//           bulletConst.distFromOppHit
//         ) &&
//         opp.dyingState === "alive"
//       ) {
//         shankedGrogs.push(grogI);
//         spentBulletsIndex.push(i);
//       }
//     });
//   });

//   return {
//     opponents: { grog: [...new Set(shankedGrogs)] },
//     bullets: [...new Set(spentBulletsIndex)],
//   };
// }

// export function updatePackageStatus(
//   player: Player,
//   packages: Package[]
// ): Package | undefined {
//   return packages.find((pack) =>
//     areTouching(player.vector.position, pack.vector.position, 50)
//   );
// }
