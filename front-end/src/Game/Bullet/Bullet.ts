import { BulletVector } from "./BulletVector";
import { Coordinates, HasPosition, VagueFacing } from "../models";
import { bulletConst } from "../constants";

export class Bullet implements HasPosition {
  vector: BulletVector;
  position: Coordinates;
  timeAlive: number | null = 0;

  constructor(pos: Coordinates, direction: VagueFacing) {
    this.vector = new BulletVector(pos, getDirection(direction));
    this.position = pos;
  }

  update(elapsedTime: number, playerPos: Coordinates) {
    if (this.timeAlive !== null) this.timeAlive += elapsedTime;

    this.position.x += this.vector.velX * elapsedTime;
    this.position.y += this.vector.velY * elapsedTime;

    const distanceBetween = Math.sqrt(
      Math.pow(playerPos.x - this.position.x, 2) +
        Math.pow(playerPos.y - this.position.y, 2)
    );

    if (distanceBetween > bulletConst.distFromPlayerDud) {
      this.timeAlive = null;
    }
  }
}

function getDirection(dir: VagueFacing): Coordinates {
  if (dir === "left") return { x: -bulletConst.speed, y: 0 };
  if (dir === "right") return { x: bulletConst.speed, y: 0 };
  return { x: 0, y: -bulletConst.speed };
}
