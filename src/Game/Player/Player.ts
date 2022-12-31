import { playerConstants, GRAVITY } from "../constants";
import { Coordinates, Keys, CharAction, Character } from "../models";
import { PlayerImager } from "./PlayerImager";
import { PlayerVectorManager } from "./PlayerVectorManager";

const { shankTime, shankCoolDown, shootCoolDown, radius } = playerConstants;

export class Player implements Character {
  jumps: number;
  imager: PlayerImager;
  shank: number;
  shoot: number;
  shot: boolean;
  vector: PlayerVectorManager;

  constructor() {
    this.jumps = 0;
    this.imager = new PlayerImager();
    this.shank = 0;
    this.shoot = 0;
    this.shot = false;
    this.vector = new PlayerVectorManager({ x: 100, y: 100 }, radius);
  }

  update(keys: Keys) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (keys.jump) this.move("Jump");

    if (keys.right && this.position.x < 400) this.move("MoveRight");
    if (keys.right && this.position.x >= 400) this.move("StopX");

    if (keys.left && this.position.x >= 100) this.move("MoveLeft");
    if (keys.left && this.position.x < 250) this.move("StopX");

    if (!keys.right && !keys.left) this.move("StopX");

    if (keys.shank && Date.now() - this.shank > shankTime + shankCoolDown) {
      this.shank = Date.now();
    }

    if (
      keys.shoot &&
      Date.now() - this.shoot > shootCoolDown &&
      !this.shanking
    ) {
      this.shoot = Date.now();
      this.shot = true;
    }

    if (keys.up) this.setUpPos();
    else this.setUpPos(false);

    if (keys.down) this.setDownPos();
    else this.setDownPos(false);

    this.velocity.y += GRAVITY;
  }

  move(action: CharAction) {
    this.vector.move(action, this.jumps, (num) => (this.jumps = num));
  }

  draw(canvas: CanvasRenderingContext2D) {
    this.imager.draw(this.vector.facing, this.shanking, this.position, canvas);
  }

  private setUpPos(up: boolean = true) {
    this.vector.setUpPos(up);
  }

  private setDownPos(down: boolean = true) {
    this.vector.setDownPos(down);
  }

  get weaponPosCurr(): Coordinates | undefined {
    if (!this.shanking) return undefined;
    if (this.vector.isVagueFacing("right")) return this.vector.posRightWeapon;
    if (this.vector.isVagueFacing("left")) return this.vector.posLeftWeapon;
    return this.vector.posUpWeapon;
  }

  get shanking() {
    return Date.now() - this.shank < shankTime;
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
  get velocity() {
    return this.vector.velocity;
  }
  get rightPos() {
    return this.vector.rightPos;
  }
  get isMovingDown() {
    return this.vector.isMovingDown;
  }
  setPosY(num: number) {
    return this.vector.stopY(num);
  }
}

export default Player;
