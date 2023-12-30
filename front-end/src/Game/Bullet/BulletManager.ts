import {
  PlayerDirectionX,
  PlayerDirectionY,
  PlayerVectorManager,
} from "../Player/PlayerVectorManager";
import { Canvas, DrawObjProps } from "../helpers/types";
import { Coordinates, VagueFacing } from "../models";
import { Bullet } from "./Bullet";
import { BulletDrawer } from "./BulletDrawer";

export class BulletManager {
  bullets: Bullet[] = [];
  bulletDrawer: BulletDrawer;

  constructor() {
    this.bulletDrawer = new BulletDrawer();
  }

  update(elapsedTime: number, playerPos: Coordinates) {
    this.bullets.forEach((bullet) =>
      // bullet.timeAlive === null
      //   ? this.bullets.splice(this.bullets.indexOf(bullet), 1)
      bullet.update(elapsedTime, playerPos)
    );
  }

  draw(drawProps: DrawObjProps) {
    this.bulletDrawer.draw(drawProps, this.bullets);
  }

  addBullet(playerVector: PlayerVectorManager) {
    const direction: PlayerDirectionX | PlayerDirectionY =
      playerVector.facingY !== "none"
        ? playerVector.facingY
        : playerVector.facingX;

    this.bullets.push(
      new Bullet(playerVector.weaponPosition(direction), direction)
    );
  }

  removeBullets(bulletIndex: number[]) {
    bulletIndex.forEach((i) => {
      this.bullets.splice(i, 1);
    });
  }

  reset() {
    this.bullets = [];
  }
}
