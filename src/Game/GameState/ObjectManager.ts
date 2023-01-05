import { Bullet } from "../Bullet";
import {
  calcPlatColl,
  updateLiveStatus,
  checkIfCaught,
  calcPlatPackageColl,
  updatePackageStatus,
} from "./GameStateFunctions";
import { HasPosition, Keys, StaticObject } from "../models";
import { Opponent } from "../Opponent/Opponent";
import Player from "../Player/Player";
import { Pot } from "../Pot";
import { createBlocks, createMatePackages, createOpponents } from "../utils";
import { Package } from "../Package";

export class ObjectManager {
  player: Player;
  platforms: StaticObject[];
  opponents: Opponent[];
  pot: Pot;
  bullets: Bullet[];
  matePackages: Package[];
  constructor() {
    this.player = new Player();
    this.platforms = createBlocks(1);
    this.opponents = createOpponents(1);
    this.pot = new Pot();
    this.bullets = [];
    this.matePackages = createMatePackages(1);
  }

  reset(level: number) {
    this.player = new Player();
    this.opponents = createOpponents(level);
    this.platforms = createBlocks(level);
    this.matePackages = createMatePackages(level);
    this.pot = new Pot();
    this.bullets = [];
  }

  updateAll(keys: Keys) {
    this.player.update(keys);
    this.opponents.forEach((opponent) => opponent.update());
    this.bullets.forEach((bullet) => bullet.update());
    this.matePackages.forEach((p) => p.update());
  }

  isCaught() {
    return checkIfCaught(this.player, this.opponents);
  }

  private shootBullet() {
    if (this.player.vector.isVagueFacing("right")) {
      this.bullets.push(new Bullet(this.player.vector.posRightWeapon, "right"));
      return;
    }
    if (this.player.vector.isVagueFacing("left")) {
      this.bullets.push(new Bullet(this.player.vector.posLeftWeapon, "left"));
      return;
    }
    if (this.player.vector.isVagueFacing("up")) {
      this.bullets.push(new Bullet(this.player.vector.posUpWeapon, "up"));
    }
  }

  calcInteractions() {
    this.platforms.forEach((platform) => {
      this.opponents.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, this.player);
      this.matePackages.forEach((p) => {
        calcPlatPackageColl(platform, p);
      });
    });
  }

  calcBullets(ammo: number): boolean {
    if (this.player.shooting && ammo > 0) {
      this.shootBullet();
      return true;
    }
    return false;
  }

  getKilledOpponents(): number | undefined {
    const { opponents, bullets } = updateLiveStatus(
      this.player,
      this.opponents,
      this.bullets
    );
    if (opponents.length > 0) {
      opponents.forEach((opp) => {
        this.opponents.splice(this.opponents.indexOf(opp), 1);
      });
    }
    if (bullets.length > 0) {
      bullets.forEach((bullet) => {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      });
    }
    return opponents.length || undefined;
  }

  getReceivedPackages(): number | undefined {
    const matePackages = updatePackageStatus(this.player, this.matePackages);
    matePackages.forEach((m) => {
      this.matePackages.splice(this.matePackages.indexOf(m), 1);
    });
    return matePackages.length || undefined;
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

  get playerXMoving(): boolean {
    return this.player.vector.velX !== 0;
  }
}
