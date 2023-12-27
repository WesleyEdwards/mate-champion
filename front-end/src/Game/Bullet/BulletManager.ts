import { PlayerVectorManager } from "../Player/PlayerVectorManager";
import { Canvas, DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
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
      bullet.isDead
        ? this.bullets.splice(this.bullets.indexOf(bullet), 1)
        : bullet.update(elapsedTime, playerPos)
    );
  }

  draw(drawProps: DrawObjProps) {
    this.bulletDrawer.draw(drawProps, this.bullets);
  }

  addBullet(playerVector: PlayerVectorManager) {
    if (playerVector.isFacing("right") || playerVector.isFacing("rightDown")) {
      this.bullets.push(new Bullet(playerVector.posRightWeapon, "right"));
      return;
    }
    if (playerVector.isFacing("left") || playerVector.isFacing("leftDown")) {
      this.bullets.push(new Bullet(playerVector.posLeftWeapon, "left"));
      return;
    }
    if (playerVector.isFacing("rightUp") || playerVector.isFacing("leftUp")) {
      this.bullets.push(new Bullet(playerVector.posUpWeapon, "up"));
    }
  }
  reset() {
    this.bullets = [];
  }
}
