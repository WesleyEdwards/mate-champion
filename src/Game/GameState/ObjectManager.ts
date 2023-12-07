import { Bullet } from "../Bullet/Bullet";
import { updateLiveStatus, areTouching } from "./GameStateFunctions";
import { HasPosition, Keys } from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";
import { Pot } from "../Pot";
import { BulletManager } from "../Bullet/BulletManager";
import { MAX_CANVAS_HEIGHT, playerConst } from "../constants";
import { MatePackageManager } from "../Platform/MatePackageManager";
import { OpponentManager } from "../Opponent/OpponentManager";
import { PlatformManager } from "../Platform/PlatformManager";
import { UpdateStatus } from "../helpers/types";

export class ObjectManager {
  player: Player;
  opponentManager: OpponentManager;
  pot: Pot;
  matePackManager: MatePackageManager;
  bulletManager: BulletManager;
  platformManager: PlatformManager;
  canvas: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.player = new Player(context);
    this.bulletManager = new BulletManager(context);
    this.opponentManager = new OpponentManager(context);
    this.pot = new Pot(context);
    this.platformManager = new PlatformManager(context);
    this.matePackManager = new MatePackageManager(
      this.platformManager.platforms,
      context
    );
    this.canvas = context;
  }

  reset(level: number) {
    this.platformManager.reset(level);
    this.matePackManager.reset(this.platformManager.platforms);
    this.player.reset();
    this.opponentManager.reset(this.canvas, level);
    this.pot.reset();
    this.bulletManager.reset();
  }

  updateAll(keys: Keys, elapsedTime: number, ammo: number): UpdateStatus {
    this.player.update(keys, elapsedTime);
    this.opponentManager.update(elapsedTime);
    this.bulletManager.update(elapsedTime);
    this.matePackManager.update(elapsedTime);
    // Calc Interactions
    this.platformManager.calcPersonColl(this.player, this.opponents);

    return {
      statsInfo: {
        moveScreenLeft: keys.right && this.playerStopped,
        moveScreenRight: keys.left && this.playerStopped,
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
    opponents.forEach((opp) => {
      this.opponents.splice(this.opponents.indexOf(opp), 1);
    });
    bullets.forEach((bullet) => {
      this.bullets.splice(this.bullets.indexOf(bullet), 1);
    });
    return opponents.length;
  }

  private get playerDies() {
    if (this.player.vector.bottomPos > MAX_CANVAS_HEIGHT - 5) return true;
    return this.opponents.some((opp) =>
      areTouching(this.player, opp.vector.posCenter, playerConst.radius * 2)
    );
  }

  get nextLevel() {
    return this.player.position.x > this.pot.vector.posX;
  }

  get objectsToUpdatePos(): Array<HasPosition[]> {
    return [
      this.platformManager.platforms,
      this.opponents,
      this.bullets,
      [this.pot],
      this.matePackManager.packages,
    ];
  }

  drawObjects() {
    this.platformManager.draw();
    this.pot.draw();
    this.bulletManager.draw();
    this.opponentManager.draw();
    this.matePackManager.draw();
    this.player.draw();
  }

  get playerStopped(): boolean {
    return this.player.vector.velX === 0;
  }

  private get bullets(): Bullet[] {
    return this.bulletManager.bullets;
  }

  private get opponents(): Opponent[] {
    return this.opponentManager.opponents;
  }
}
