import { playerConstants, MAX_CANVAS_HEIGHT, GRAVITY } from "../constants";
import { Coordinates, Keys, CharAction, Character } from "../models";
import { debounceLog } from "../utils";
import { PlayerDirection } from "./models";
import { PlayerImager } from "./PlayerImager";

const { shankTime, shankCoolDown, shootCoolDown, moveSpeed, radius } =
  playerConstants;

export class Player implements Character {
  position: Coordinates;
  velocity: Coordinates;
  jumps: number;
  width: number;
  height: number;
  imager: PlayerImager;
  shank: number;
  shoot: number;
  shot: boolean;
  facing: PlayerDirection;

  constructor() {
    this.position = { x: 100, y: 100 };
    this.velocity = { x: 0, y: 0 };
    this.jumps = 0;
    this.width = radius * 2;
    this.height = radius * 2;
    this.imager = new PlayerImager();
    this.shank = 0;
    this.shoot = 0;
    this.shot = false;
    this.facing = "right";
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

    if (keys.shoot && Date.now() - this.shoot > shootCoolDown) {
      this.shoot = Date.now();
      this.shot = true;
    }

    if (keys.up) this.setUpPos();
    else this.setUpPos(false);

    if (this.bottomPos > MAX_CANVAS_HEIGHT) this.move("StopY");
    else this.velocity.y += GRAVITY;
  }

  move(action: CharAction) {
    if (action === "MoveRight") {
      this.velocity.x = moveSpeed;
      this.facing = "right";
    }
    if (action === "MoveLeft") {
      this.velocity.x = -moveSpeed;
      this.facing = "left";
    }
    if (action === "StopX") this.velocity.x = 0;
    if (action === "StopY") {
      this.velocity.y = 0;
      this.position.y = MAX_CANVAS_HEIGHT - this.height;
    }

    if (action === "Jump" && this.velocity.y === 0 && this.jumps < 1) {
      this.velocity.y = -15;
      this.jumps++;
    }
    if (this.velocity.y > 0) this.jumps = 0;
  }

  draw(canvas: CanvasRenderingContext2D) {
    this.imager.draw(this.facing, this.shanking, this.position, canvas);
  }

  private setUpPos(up: boolean = true) {
    if (up) {
      if (this.facing === "right") this.facing = "rightUp";
      if (this.facing === "left") this.facing = "leftUp";
    } else {
      if (this.facing === "rightUp") this.facing = "right";
      if (this.facing === "leftUp") this.facing = "left";
    }
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

  get bottomPos() {
    return this.position.y + this.height;
  }
  get rightPos() {
    return this.position.x + this.width;
  }
}

export default Player;
