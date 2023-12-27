import { GRAVITY, MAX_CANVAS_HEIGHT, playerConst } from "../constants";
import { CharAction, Coordinates, VectorMan } from "../models";
import { PlayerDirection } from "./models";

export class PlayerVectorManager implements VectorMan {
  facing: PlayerDirection = "right";
  jumps: number = 0;
  coyoteTime = 0;

  velocity: Coordinates = { x: 0, y: 0 };
  moveSpeed: number = playerConst.moveSpeed;
  prevVelY: number = 0;
  prevPosX: number = playerConst.initPos.x;
  prevPosY: number = playerConst.initPos.y;
  gravityFactor: number | undefined = undefined;

  position: Coordinates = { ...playerConst.initPos };

  update(elapsedTime: number) {
    this.prevPosX = this.position.x;
    this.prevPosY = this.position.y;
    this.position.x += this.velocity.x * elapsedTime;
    this.position.y += this.velocity.y * elapsedTime;
    this.coyoteTime += elapsedTime;
  }

  updateGravity(elapsedTime: number, isJumping: boolean) {
    if (this.gravityFactor) {
      this.gravityFactor *= playerConst.jumpGravityFrameDecrease;
    }
    if (!isJumping || this.velocity.y > 0) {
      this.gravityFactor = undefined;
    }
    if (this.coyoteTime > playerConst.maxCoyoteTime || this.velocity.y < 0) {
      const jumpFactor = this.gravityFactor
        ? (1 - this.gravityFactor) * GRAVITY
        : GRAVITY;
      this.setVelY(this.velocity.y + jumpFactor * elapsedTime);
    }
  }

  move(action: CharAction) {
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
      this.stopY(MAX_CANVAS_HEIGHT - this.radius * 2);
    }
    if (action === "Jump" && this.velocity.y === 0 && this.jumps < 1) {
      this.setVelY(playerConst.jumpSpeed);
      this.setPosY(this.posY - 1);
      this.gravityFactor = playerConst.jumpGravityFactor;
      this.jumps += 1;
    }
    if (this.velocity.y > 0) this.jumps = 0;
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
      x: this.posX + this.radius * 3,
      y: this.centerY,
    };
  }
  get posLeftWeapon() {
    return {
      x: this.posX - this.radius,
      y: this.centerY,
    };
  }
  get posUpWeapon() {
    return {
      x: this.centerX,
      y: this.posY - this.radius,
    };
  }

  stopY(yPos: number) {
    this.velocity.y = 0;
    this.setPosY(yPos);
  }
  setVelX(x: number) {
    this.velocity.x = x;
  }
  setVelY(y: number) {
    this.velocity.y = y;
  }

  get posX() {
    return this.position.x;
  }
  get posY() {
    return this.position.y;
  }
  get bottomPos() {
    return this.position.y + this.radius * 2;
  }
  get rightPos() {
    return this.position.x + this.radius * 2;
  }
  get centerX() {
    return this.position.x + this.radius;
  }
  get centerY() {
    return this.position.y + this.radius;
  }
  get posCenter() {
    return {
      x: this.centerX,
      y: this.centerY,
    };
  }

  relativePos(xOffset: number) {
    return {
      x: this.position.x - xOffset,
      y: this.position.y,
    };
  }

  get radius() {
    return playerConst.radius;
  }
  get width() {
    return this.radius * 2;
  }
  get height() {
    return this.radius * 2;
  }

  setPosX(x: number) {
    this.position.x = x;
  }
  setPosY(y: number) {
    this.position.y = y;
  }
  setOnPlatform(y: number) {
    this.coyoteTime = 0;
    this.position.y = y;
    this.velocity.y = 0;
  }
}
