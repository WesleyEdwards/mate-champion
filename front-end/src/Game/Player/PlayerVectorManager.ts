import { GRAVITY, MAX_CANVAS_HEIGHT, playerConst } from "../constants";
import { CharAction, Coordinates, VectorMan } from "../models";

export type PlayerDirectionX = "left" | "right";
export type PlayerDirectionY = "up" | "down" | "none";
export type PlayerAction = "shoot" | "melee" | "none";
export type PlayerMove = "walk" | "jump" | "none";

export class PlayerVectorManager implements VectorMan {
  facingX: PlayerDirectionX = "right";
  facingY: PlayerDirectionY = "none";
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
      this.facingX = "right";
    }
    if (action === "MoveLeft") {
      this.setVelX(-this.moveSpeed);
      this.facingX = "left";
    }
    if (action === "StopX") this.setVelX(0);

    if (action === "Jump" && this.velocity.y === 0 && this.jumps < 1) {
      this.setVelY(playerConst.jumpSpeed);
      this.setPosY(this.position.y - 1);
      this.gravityFactor = playerConst.jumpGravityFactor;
      this.jumps += 1;
    }
    if (this.velocity.y > 0) this.jumps = 0;
  }

  setUpPos(up: boolean = true) {
    this.facingY = up ? "up" : "none";
  }

  setDownPos(down: boolean = true) {
    this.facingY = down ? "down" : "none";
  }

  weaponPosition(direction: PlayerDirectionX | PlayerDirectionY) {
    const map: Record<
      PlayerDirectionX | PlayerDirectionY,
      (og: Coordinates) => Coordinates
    > = {
      left: (og) => ({
        x: og.x - playerConst.radius,
        y: og.y,
      }),
      right: (og) => ({
        x: og.x + playerConst.radius,
        y: og.y,
      }),
      up: (og) => ({
        x: og.x,
        y: og.y - playerConst.radius,
      }),
      down: (og) => ({
        x: og.x,
        y: og.y + playerConst.radius,
      }),
      none: (og) => og,
    };
    return map[direction](this.position);
  }

  get weaponPosCurr() {
    if (this.facingY !== "none") {
      return this.weaponPosition(this.facingY);
    }
    return this.weaponPosition(this.facingX);
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

  relativePos(xOffset: number) {
    return {
      x: this.position.x - xOffset,
      y: this.position.y,
    };
  }

  get width() {
    return playerConst.radius * 2;
  }
  get height() {
    return playerConst.radius * 2;
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
