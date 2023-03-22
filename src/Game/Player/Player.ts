import {
  GRAVITY,
  SHANK_COOL_DOWN,
  SHANK_TIME,
  SHOOT_COOL_DOWN,
} from "../constants";
import { Coordinates, Keys, CharAction, Character } from "../models";
import { debounceLog, vagueFacing } from "../utils";
import { PlayerImager } from "./PlayerImager";
import { PlayerVectorManager } from "./PlayerVectorManager";

export class Player implements Character {
  jumps: number = 0;
  imager: PlayerImager = new PlayerImager();
  shank: number = 0;
  shoot: number = 0;
  shot: boolean = false;
  vector: PlayerVectorManager = new PlayerVectorManager();
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  reset() {
    this.jumps = 0;
    this.shank = 0;
    this.shoot = 0;
    this.shot = false;
    this.vector = new PlayerVectorManager();
  }

  update(keys: Keys, elapsedTime: number) {
    this.position.x += this.vector.velX * elapsedTime;
    this.position.y += this.vector.velY * elapsedTime;
    // debounceLog("player", this.vector.velY, this.vector.velX);

    if (keys.jump) this.move("Jump");

    if (keys.right && this.position.x < 400) this.move("MoveRight");
    if (keys.right && this.position.x >= 400) this.move("StopX");

    if (keys.left && this.position.x >= 100) this.move("MoveLeft");
    if (keys.left && this.position.x < 250) this.move("StopX");

    if (!keys.right && !keys.left) this.move("StopX");

    if (keys.shank && Date.now() - this.shank > SHANK_TIME + SHANK_COOL_DOWN) {
      if (
        this.vector.isFacing("right") ||
        this.vector.isFacing("rightUp") ||
        this.vector.isFacing("leftUp") ||
        this.vector.isFacing("left")
      ) {
        this.shank = Date.now();
      }
    }

    if (
      keys.shoot &&
      Date.now() - this.shoot > SHOOT_COOL_DOWN &&
      !this.shanking
    ) {
      this.shoot = Date.now();
      this.shot = true;
    }

    if (keys.up) this.setUpPos();
    else this.setUpPos(false);

    if (keys.down) this.setDownPos();
    else this.setDownPos(false);

    this.vector.setVelY(this.vector.velY + GRAVITY * elapsedTime);
  }

  move(action: CharAction) {
    this.vector.move(action, this.jumps, (num) => (this.jumps = num));
  }

  draw() {
    this.imager.draw(
      this.vector.facing,
      this.shanking,
      this.position,
      this.context
    );
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
    return Date.now() - this.shank < SHANK_TIME;
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
}

export default Player;
