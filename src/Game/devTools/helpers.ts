import { ObjectManager } from "../GameState/ObjectManager";
import { LevelInfo } from "../level-info/levelInfo";

export function exportLevelInfo(objManager: ObjectManager) {
  const levelInfo: LevelInfo = {
    packages: objManager.matePackManager.packages.map((p) => ({
      x: p.vector.posX,
      y: p.vector.posY,
    })),
    opponents: {
      grog: objManager.opponentManager.opponents.grog.map((o) => ({
        initPos: { x: o.vector.posX, y: o.vector.posY },
        moveSpeed: o.vector.moveSpeed,
      })),
    },
    platforms: objManager.platformManager.platforms
      .filter((p) => !p.isFloor)
      .map((p) => ({
        x: p.vector.posX,
        y: p.vector.posY,
        width: p.vector.width,
        height: p.vector.height,
        color: p.color,
      }))
      .sort((a, b) => a.x - b.x),
    floors: objManager.platformManager.platforms
      .filter((p) => p.isFloor)
      .map((p) => ({
        x: p.vector.posX,
        width: p.vector.width,
        color: p.color,
      }))
      .sort((a, b) => a.x - b.x),
  };

  console.log(levelInfo);
}
