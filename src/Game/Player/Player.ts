import { DrawManager } from "../Drawing/DrawManager";
import { DrawImageInfo } from "../Drawing/ImageRepos";
import { SpriteOption } from "../Drawing/drawingUtils";
import { GRAVITY, playerConst } from "../constants";
import { Coordinates, Keys, CharAction, Character } from "../models";
import { vagueFacing } from "../helpers/utils";
import { shankingImage } from "./PlayerUtils";
import { PlayerVectorManager } from "./PlayerVectorManager";
import { Canvas, DrawObjProps } from "../helpers/types";

export class Player implements Character {
  shank: number = 0;
  shoot: number = 0;
  shot: boolean = false;
  vector: PlayerVectorManager = new PlayerVectorManager();
  drawManager: DrawManager;
  whereToDrawOffset: number = 0;
  drift: number = 0;

  constructor() {
    this.drawManager = new DrawManager(
      "player",
      playerConst.radius * 2,
      playerConst.radius * 2
    );
  }

  reset() {
    this.shank = 0;
    this.shoot = 0;
    this.shot = false;
    this.vector = new PlayerVectorManager();
  }

  update(keys: Keys, elapsedTime: number) {
    this.vector.update(elapsedTime);

    if (keys.jump || keys.toJump > 0) {
      this.move("Jump");
      keys.toJump = 0;
    }

    if (keys.right) this.move("MoveRight");
    if (keys.left) this.move("MoveLeft");

    if (!keys.right && !keys.left) this.move("StopX");

    if (
      (keys.shank || keys.toShank > 0) &&
      Date.now() - this.shank >
        playerConst.shankTime + playerConst.shankCoolDown
    ) {
      if (
        this.vector.isFacing("right") ||
        this.vector.isFacing("rightUp") ||
        this.vector.isFacing("leftUp") ||
        this.vector.isFacing("left")
      ) {
        this.shank = Date.now();
      }
      keys.toShank = 0;
    }

    if (
      (keys.shoot || keys.toShoot > 0) &&
      Date.now() - this.shoot > playerConst.shootCoolDown &&
      !this.shanking
    ) {
      this.shoot = Date.now();
      this.shot = true;
      keys.shoot = false;
      keys.toShoot = 0;
    }

    if (keys.up) this.setUpPos();
    else this.setUpPos(false);

    if (keys.down) this.setDownPos();
    else this.setDownPos(false);

    this.vector.setVelY(this.vector.velocity.y + GRAVITY * elapsedTime);
    this.calcDrift(elapsedTime);
  }

  calcDrift(elapsedTime: number) {
    if (this.drift < playerConst.driftX && this.vector.velocity.x > 0) {
      this.drift += this.vector.velocity.x * elapsedTime;
      return;
    }

    if (this.drift > -playerConst.driftX && this.vector.velocity.x < 0) {
      this.drift += this.vector.velocity.x * elapsedTime;
      return;
    }

    this.whereToDrawOffset += this.vector.velocity.x * elapsedTime;
  }

  move(action: CharAction) {
    this.vector.move(action);
  }

  draw(drawProps: DrawObjProps) {
    const direction: SpriteOption = shankingImage(
      this.vector.facing,
      this.shanking
    );

    this.drawManager.draw(drawProps, this.position, direction);
  }

  private setUpPos(up: boolean = true) {
    this.vector.setUpPos(up);
  }

  private setDownPos(down: boolean = true) {
    this.vector.setDownPos(down);
  }

  get weaponPosCurr(): Coordinates | undefined {
    if (!this.shanking) return undefined;
    if (this.vector.isFacing("right") || this.vector.isFacing("rightDown")) {
      return this.vector.posRightWeapon;
    }
    if (this.vector.isFacing("left") || this.vector.isFacing("leftDown")) {
      return this.vector.posLeftWeapon;
    }
    return this.vector.posUpWeapon;
  }

  get shanking() {
    return Date.now() - this.shank < playerConst.shankTime;
  }
  get shooting() {
    if (this.shot) {
      this.shot = false;
      return true;
    }
    return false;
  }

  get position() {
    return this.vector.position;
  }
  get posCenter() {
    return this.vector.posCenter;
  }
  setPosY(num: number) {
    return this.vector.stopY(num);
  }
  get facing() {
    return vagueFacing(this.vector.facing);
  }

  get whereToDraw() {
    return this.whereToDrawOffset;
  }
}

export default Player;
