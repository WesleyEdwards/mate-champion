import { Bullet } from "../Bullet/Bullet";
import { updateLiveStatus, areTouching } from "./GameStateFunctions";
import { Keys } from "../models";
import Player from "../Player/Player";
import { Pot } from "../Pot";
import { BulletManager } from "../Bullet/BulletManager";
import { MAX_CANVAS_HEIGHT, playerConst } from "../constants";
import { MatePackageManager } from "../Platform/MatePackageManager";
import { OpponentManager, Opponents } from "../Opponent/OpponentManager";
import { PlatformManager } from "../Platform/PlatformManager";
import { Canvas, DrawObjProps, UpdateStatus } from "../helpers/types";
import { Grog } from "../Opponent/Grog";

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

  updateAll(
    keys: Keys,
    elapsedTime: number,
    ammo: number,
    screenStartX: number
  ): UpdateStatus {
    this.player.update(keys, elapsedTime, screenStartX);
    this.opponentManager.update(elapsedTime);
    this.bulletManager.update(elapsedTime, screenStartX);

    this.platformManager.calcPersonColl(this.player, this.opponents);

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
      this.opponents,
      this.bullets
    );
    opponents.grog.forEach((opp) => {
      this.opponents.grog.splice(this.opponents.grog.indexOf(opp), 1);
    });
    bullets.forEach((bullet) => {
      this.bullets.splice(this.bullets.indexOf(bullet), 1);
    });
    return opponents.grog.length;
  }

  private get playerDies() {
    if (this.player.vector.bottomPos > MAX_CANVAS_HEIGHT - 5) return true;
    return this.opponents.grog.some((opp) =>
      areTouching(this.player, opp.vector.posCenter, playerConst.radius * 2)
    );
  }

  get nextLevel() {
    return this.player.position.x > this.pot.vector.posX;
  }

  drawObjects(cxt: Canvas, offsetX: number) {
    const drawProps: DrawObjProps = { cxt, offsetX };
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

  private get bullets(): Bullet[] {
    return this.bulletManager.bullets;
  }

  private get opponents(): Opponents {
    return this.opponentManager.opponents;
  }
}
