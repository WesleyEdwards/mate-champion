import { Bullet } from "../Bullet/Bullet";
import {
  calcPlatColl,
  updateLiveStatus,
  updatePackageStatus,
  areTouching,
} from "./GameStateFunctions";
import { HasPosition, Keys, StaticObject } from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";
import { Pot } from "../Pot";
import { Package } from "../Bullet/Package";
import {
  createBlocks,
  createMatePackages,
  createOpponents,
} from "../constructors";
import { BulletManager } from "../Bullet/BulletManager";
import { MAX_CANVAS_HEIGHT, PLAYER_CONST, UpdateStatus } from "../constants";

export class ObjectManager {
  player: Player = new Player();
  platforms: StaticObject[] = createBlocks(1);
  opponents: Opponent[] = createOpponents(1);
  pot: Pot;
  matePackages: Package[];
  bulletManager: BulletManager;

  constructor(context: CanvasRenderingContext2D) {
    this.bulletManager = new BulletManager(context);
    this.pot = new Pot(context);
    this.platforms = createBlocks(1);
    this.matePackages = createMatePackages(1, this.platforms);
  }

  reset(level: number) {
    const plats = createBlocks(level);
    this.platforms = plats;
    this.matePackages = createMatePackages(level, plats);

    this.player = new Player();
    this.opponents = createOpponents(level);
    this.pot.reset();
    this.bulletManager.reset();
  }

  updateAll(keys: Keys, elapsedTime: number, ammo: number): UpdateStatus {
    this.player.update(keys);
    this.opponents.forEach((opponent) => opponent.update());
    this.bulletManager.update(elapsedTime);
    this.matePackages.forEach((p) => p.update());
    // Calc Interactions
    this.platforms.forEach((platform) => {
      this.opponents.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, this.player);
    });
    return {
      statsInfo: {
        moveScreenLeft: keys.right && this.playerStopped,
        moveScreenRight: keys.left && this.playerStopped,
        killedOpp: this.getKilledOpponents(),
        shot: this.calcBullets(ammo),
        packagesReceived: this.getReceivedPackages(),
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

  private getReceivedPackages(): boolean {
    const matePackage = updatePackageStatus(this.player, this.matePackages);
    if (!matePackage) return false;
    this.matePackages.splice(this.matePackages.indexOf(matePackage), 1);
    return true;
  }

  private get playerDies() {
    if (this.player.vector.bottomPos > MAX_CANVAS_HEIGHT - 5) return true;
    return this.opponents.some((opp) =>
      areTouching(this.player, opp.vector.posCenter, PLAYER_CONST.radius * 2)
    );
  }

  get nextLevel() {
    return this.player.position.x > this.pot.vector.posX;
  }

  get objectsToUpdatePos(): Array<HasPosition[]> {
    return [
      this.platforms,
      this.opponents,
      this.bullets,
      [this.pot],
      this.matePackages,
    ];
  }

  drawObjects(context: CanvasRenderingContext2D) {
    this.platforms.forEach((platform) => platform.draw(context));
    this.pot.draw();
    this.bulletManager.draw();
    this.opponents.forEach((opponent) => opponent.draw(context));
    this.matePackages.forEach((p) => p.draw(context));
    this.player.draw(context);
  }

  get playerStopped(): boolean {
    return this.player.vector.velX === 0;
  }

  private get bullets(): Bullet[] {
    return this.bulletManager.bullets;
  }
}
