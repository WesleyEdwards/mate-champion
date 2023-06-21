import {
  MAX_CANVAS_HEIGHT,
  PLAYER_INIT_POS,
  PLAYER_JUMP_SPEED,
  PLAYER_MOVE_SPEED,
  PLAYER_RADIUS,
} from "../constants";
import { CharAction, Coordinates } from "../models";
import { CharVectorManager } from "../VectorManager/CharVectorManager";
import { PlayerDirection } from "./models";

export class PlayerVectorManager extends CharVectorManager {
  facing: PlayerDirection;
  constructor() {
    super({ ...PLAYER_INIT_POS }, PLAYER_MOVE_SPEED, PLAYER_RADIUS);
    this.facing = "right";
  }

  move(action: CharAction, jumps: number, setJumps: (add: number) => void) {
    if (action === "MoveRight") {
      this.setVelX(this.moveSpeed);
      this.setFacing("right");
    }
    if (action === "MoveLeft") {
      this.setVelX(-this.moveSpeed);
      this.setFacing("left");
    }
    if (action === "StopX") this.setVelX(0);

    if (this.bottomPos > MAX_CANVAS_HEIGHT) {
      this.stopY(MAX_CANVAS_HEIGHT - this.height);
    }
    if (action === "Jump" && this.velY === 0 && jumps < 1) {
      this.setVelY(PLAYER_JUMP_SPEED);
      this.setPosY(this.posY - 1);
      setJumps((jumps += 1));
    }
    if (this.velY > 0) setJumps(0);
  }

  isFacing(direction: PlayerDirection) {
    return this.facing === direction;
  }
  setFacing(direction: PlayerDirection) {
    this.facing = direction;
  }

  setUpPos(up: boolean = true) {
    if (up) {
      if (this.isFacing("right")) this.setFacing("rightUp");
      if (this.isFacing("left")) this.setFacing("leftUp");
    } else {
      if (this.isFacing("rightUp")) this.setFacing("right");
      if (this.isFacing("leftUp")) this.setFacing("left");
    }
  }

  setDownPos(down: boolean = true) {
    if (down) {
      if (this.isFacing("right")) this.setFacing("rightDown");
      if (this.isFacing("left")) this.setFacing("leftDown");
    } else {
      if (this.isFacing("rightDown")) this.setFacing("right");
      if (this.isFacing("leftDown")) this.setFacing("left");
    }
  }

  get isMovingDown() {
    return this.facing === "leftDown" || this.facing === "rightDown";
  }

  get posRightWeapon() {
    return {
      x: this.posX + this.width * 1.5,
      y: this.centerY,
    };
  }
  get posLeftWeapon() {
    return {
      x: this.posX - this.width / 2,
      y: this.centerY,
    };
  }
  get posUpWeapon() {
    return {
      x: this.centerX,
      y: this.posY - this.height / 2,
    };
  }
}
