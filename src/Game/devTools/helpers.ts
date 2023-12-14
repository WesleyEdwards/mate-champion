import { ObjectManager } from "../GameState/ObjectManager";
import { LevelInfo } from "../level-info/levelInfo";
import { Coordinates, HasPosition } from "../models";

const { round } = Math;

export function exportLevelInfo(objManager: ObjectManager) {
  const levelInfo: LevelInfo = {
    packages: objManager.matePackManager.packages.map((p) => ({
      x: round(p.vector.posX),
      y: round(p.vector.posY),
    })),
    opponents: {
      grog: objManager.opponentManager.opponents.grog.map((o) => ({
        initPos: { x: round(o.vector.posX), y: round(o.vector.posY) },
        moveSpeed: o.vector.moveSpeed,
      })),
    },
    platforms: objManager.platformManager.platforms
      .filter((p) => !p.isFloor)
      .map((p) => ({
        x: round(p.vector.posX),
        y: round(p.vector.posY),
        width: round(p.vector.width),
        height: round(p.vector.height),
        color: p.color,
      }))
      .sort((a, b) => a.x - b.x),
    floors: objManager.platformManager.platforms
      .filter((p) => p.isFloor)
      .map((p) => ({
        x: round(p.vector.posX),
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
      coor1.x <= item.vector.posX + item.vector.width &&
      coor2.x >= item.vector.posX &&
      coor1.y <= item.vector.posY + item.vector.height &&
      coor2.y >= item.vector.posY
  );
}

export function findExistingItem(
  x: number,
  y: number,
  items: HasPosition[]
): HasPosition | null {
  return (
    items.find(
      (item) =>
        x >= item.vector.posX &&
        x <= item.vector.posX + item.vector.width &&
        y >= item.vector.posY &&
        y <= item.vector.posY + item.vector.height
    ) || null
  );
}
