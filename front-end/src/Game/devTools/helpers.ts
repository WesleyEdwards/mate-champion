import { ObjectManager } from "../GameState/ObjectManager";
import { LevelInfo } from "../level-info/levelInfo";
import { Coordinates, HasPosition } from "../models";

const { round } = Math;

export function exportLevelInfo(objManager: ObjectManager) {
  const levelInfo: LevelInfo = {
    packages: objManager.matePackManager.packages
      .map((p) => ({
        x: round(p.vector.posX),
        y: round(p.vector.posY),
      }))
      .sort((a, b) => a.x - b.x),
    opponents: {
      grog: objManager.opponentManager.opponents.grog
        .map((o) => ({
          initPos: { x: round(o.vector.posX), y: round(o.vector.posY) },
          moveSpeed: o.vector.moveSpeed,
          jumpOften: o.jumpOften,
        }))
        .sort((a, b) => a.initPos.x - b.initPos.x),
    },
    platforms: objManager.platformManager.platforms
      .filter((p) => !p.isFloor)
      .map((p) => ({
        x: round(p.vector.position.x),
        y: round(p.vector.position.y),
        width: round(p.vector.width),
        height: round(p.vector.height),
        color: p.color,
      }))
      .sort((a, b) => a.x - b.x),
    floors: objManager.platformManager.platforms
      .filter((p) => p.isFloor)
      .map((p) => ({
        x: round(p.vector.position.x),
        width: round(p.vector.width),
        color: p.color,
      }))
      .sort((a, b) => a.x - b.x),
  };

  console.log(levelInfo);
}

export function findExistingItems(
  coor1: Coordinates,
  coor2: Coordinates,
  items: HasPosition[]
): HasPosition[] {
  return items.filter(
    (item) =>
      coor1.x <= item.vector.position.x + item.vector.width &&
      coor2.x >= item.vector.position.x &&
      coor1.y <= item.vector.position.y + item.vector.height &&
      coor2.y >= item.vector.position.y
  );
}

export function findExistingItem(
  x: number,
  y: number,
  items: HasPosition[]
): HasPosition | null {
  return (
    items.find((item) => {
      // platforms base their position on the top-left corner,
      // while everything else is based on the middle of the object
      if ("isFloor" in item) {
        return (
          x >= item.vector.position.x &&
          x <= item.vector.position.x + item.vector.width &&
          y >= item.vector.position.y &&
          y <= item.vector.position.y + item.vector.height
        );
      }
      const distX = item.vector.width / 2;
      const distY = item.vector.height / 2;
      return (
        x >= item.vector.position.x - distX &&
        x <= item.vector.position.x + distX &&
        y >= item.vector.position.y - distY &&
        y <= item.vector.position.y + distY
      );
    }) || null
  );
}
