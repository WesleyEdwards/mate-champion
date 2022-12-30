import { Bullet } from "../Bullet";
import {
  calcPlatColl,
  updateLiveStatus,
  checkIfCaught,
} from "../GameState/GameStateFunctions";
import { HasPosition, Keys } from "../models";
import { Opponent } from "../Opponent/Opponent";
import { Platform } from "../Platform";
import Player from "../Player/Player";
import { Pot } from "../Pot";
import { createPlatforms, createOpponents } from "../utils";

export class ObjectManager {
  player: Player;
  platforms: Platform[];
  opponents: Opponent[];
  pot: Pot;
  bullets: Bullet[];
  constructor() {
    this.player = new Player();
    this.platforms = createPlatforms(1);
    this.opponents = createOpponents(1);
    this.pot = new Pot();
    this.bullets = [];
  }

  reset(level: number) {
    this.player = new Player();
    this.opponents = createOpponents(level);
    this.platforms = createPlatforms(level);
    this.pot = new Pot();
  }

  updateAll(keys: Keys) {
    this.player.update(keys);
    this.opponents.forEach((opponent) => opponent.update());
    this.bullets.forEach((bullet) => bullet.update());
  }

  isCaught() {
    return checkIfCaught(this.player, this.opponents);
  }

  private shootBullet() {
    const facing = this.player.vagueFacing;
    if (facing === "right") {
      this.bullets.push(new Bullet(this.player.posRightWeapon, facing));
      return;
    }
    if (facing === "left") {
      this.bullets.push(new Bullet(this.player.posLeftWeapon, facing));
      return;
    }
    this.bullets.push(new Bullet(this.player.posUpWeapon, facing));
  }

  calcInteractions() {
    this.platforms.forEach((platform) => {
      this.opponents.forEach((opp) => calcPlatColl(platform, opp));
      calcPlatColl(platform, this.player);
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

  get nextLevel() {
    return this.player.position.x > this.pot.position.x;
  }

  get objectsToUpdatePos(): Array<HasPosition[]> {
    return [this.platforms, this.opponents, this.bullets, [this.pot]];
  }

  get playerXMoving(): boolean {
    return this.player.velocity.x !== 0;
  }
}
