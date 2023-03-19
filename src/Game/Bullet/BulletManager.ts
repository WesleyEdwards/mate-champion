import { PlayerVectorManager } from "../Player/PlayerVectorManager";
import { Bullet } from "./Bullet";
import { BulletDrawer } from "./BulletDrawer";

export class BulletManager {
  bullets: Bullet[] = [];
  bulletDrawer: BulletDrawer;

  constructor(context: CanvasRenderingContext2D) {
    this.bulletDrawer = new BulletDrawer(context);
  }

  update(elapsedTime: number) {
    this.bullets.forEach((bullet) => bullet.update(elapsedTime));
  }

  draw() {
    this.bulletDrawer.draw(this.bullets);
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
