import {
  calcPlatOppCollision,
  calcPlatPlayerCollision,
  updateLiveStatus,
} from "./GameStateFunctions";
import { Coordinates, Keys } from "../models";
import Player from "../Player/Player";
import { Pot } from "../Pot";
import { BulletManager } from "../Bullet/BulletManager";
import { MAX_CANVAS_HEIGHT } from "../constants";
import { MatePackageManager } from "../Platform/MatePackageManager";
import { OpponentManager } from "../Opponent/OpponentManager";
import { PlatformManager } from "../Platform/PlatformManager";
import { Canvas, DrawObjProps, UpdateStatus } from "../helpers/types";

export class ObjectManager {
  player: Player = new Player();
  opponentManager: OpponentManager = new OpponentManager();
  bulletManager: BulletManager = new BulletManager();
  matePackManager: MatePackageManager = new MatePackageManager();
  platformManager: PlatformManager = new PlatformManager();
  pot: Pot = new Pot();

  reset(level: number) {
    this.platformManager.reset(level);
    this.matePackManager.reset(level);
    this.player.reset();
    this.opponentManager.reset(level);
    this.pot.reset();
    this.bulletManager.reset();
  }

  updateAll(keys: Keys, elapsedTime: number, ammo: number): UpdateStatus {
    this.player.update(keys, elapsedTime);
    this.opponentManager.update(elapsedTime);
    this.bulletManager.update(elapsedTime, this.player.position);

    this.calcPersonColl();

    return {
      statsInfo: {
        killedOpp: this.getKilledOpponents(),
        shot: this.calcBullets(ammo),
        packagesReceived: this.matePackManager.getReceivedPackages(this.player),
      },
      levelInfo: {
        isCaught: this.playerDies,
        nextLevel: this.nextLevel,
      },
    };
  }

  private calcBullets(ammo: number): boolean {
    if (this.player.shooting && ammo > 0) {
      this.bulletManager.addBullet(this.player.vector);
      return true;
    }
    return false;
  }

  private getKilledOpponents(): number {
    const { opponents, bullets } = updateLiveStatus(
      this.player,
      this.opponentManager.opponents,
      this.bulletManager.bullets
    );
    this.opponentManager.removeOpponents(opponents);
    this.bulletManager.removeBullets(bullets);
    return opponents.grog.length;
  }

  private get playerDies() {
    if (
      this.player.vector.position.y + this.player.vector.height / 2 >
      MAX_CANVAS_HEIGHT - 5
    )
      return true;
    return this.opponentManager.touchingPlayer(this.player.position);
  }

  get nextLevel() {
    return this.player.position.x > this.pot.vector.posX;
  }

  drawObjects(cxt: Canvas, camOffset: Coordinates) {
    const drawProps: DrawObjProps = { cxt, camOffset };
    this.platformManager.draw(drawProps);
    this.pot.draw(drawProps);
    this.bulletManager.draw(drawProps);
    this.opponentManager.draw(drawProps);
    this.matePackManager.draw(drawProps);
    this.player.draw(drawProps);
  }

  get playerStopped(): boolean {
    return this.player.vector.velocity.x === 0;
  }

  calcPersonColl() {
    this.platformManager.platforms.forEach((platform) => {
      this.opponentManager.opponents.grog.forEach((opp) =>
        calcPlatOppCollision(platform, opp)
      );
      calcPlatPlayerCollision(platform, this.player);
    });
  }
}