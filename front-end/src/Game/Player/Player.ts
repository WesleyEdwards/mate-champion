import { playerConst } from "../constants";
import { Coordinates, Keys, CharAction, Character } from "../models";
import { getSpriteDisplay } from "./PlayerUtils";
import { PlayerAction, PlayerVectorManager } from "./PlayerVectorManager";
import { DrawObjProps } from "../helpers/types";
import { PlayerDrawManager, SpriteDisplay } from "./PlayerDrawManager";

export class Player implements Character {
  shank: number = 0;
  shoot: number = 0;
  shot: boolean = false;
  vector: PlayerVectorManager = new PlayerVectorManager();
  drawManager: PlayerDrawManager = new PlayerDrawManager();
  onPlatform: boolean = false;

  constructor() {}

  reset() {
    this.shank = 0;
    this.shoot = 0;
    this.shot = false;
    this.vector = new PlayerVectorManager();
  }

  update(keys: Keys, elapsedTime: number) {
    this.vector.update(elapsedTime);
    this.drawManager.update(elapsedTime);

    if (keys.jump || keys.toJump > 0) {
      this.move("Jump");
      keys.toJump = 0;
    }

    if (keys.right) this.move("MoveRight");
    const canMoveLeft = this.position.x >= playerConst.initPos.x - 100;
    if (keys.left && canMoveLeft) this.move("MoveLeft");

    if ((!keys.right && !keys.left) || (!canMoveLeft && keys.left)) {
      this.move("StopX");
    }

    if (
      (keys.shank || keys.toShank > 0) &&
      Date.now() - this.shank >
        playerConst.shankTime + playerConst.shankCoolDown
    ) {
      if (this.vector.facingX === "left" || this.vector.facingX === "right") {
        this.shank = Date.now();
      }
      keys.toShank = 0;
    }

    if (
      (keys.shoot || keys.toShoot > 0) &&
      Date.now() - this.shoot > playerConst.shootCoolDown &&
      this.currAction !== "melee"
    ) {
      this.shoot = Date.now();
      this.shot = true;
      keys.shoot = false;
      keys.toShoot = 0;
    }

    if (keys.up || keys.down) {
      this.vector.facingY = keys.up ? "up" : "down";
    } else {
      this.vector.facingY = "none";
    }

    this.vector.updateGravity(elapsedTime, keys.jump);
  }

  move(action: CharAction) {
    this.vector.move(action);
  }

  draw(drawProps: DrawObjProps) {
    this.drawManager.draw(
      drawProps,
      this.position,
      getSpriteDisplay(
        this.vector.facingX,
        this.vector.facingY,
        this.currAction,
        this.vector.velocity.x !== 0 ? "walk" : "none"
      )
    );
  }

  get weaponPosCurr(): Coordinates | undefined {
    if (this.currAction !== "melee") return undefined;
    return this.vector.weaponPosCurr;
  }

  get currAction(): PlayerAction {
    if (Date.now() - this.shank < playerConst.shankTime) {
      return "melee";
    }
    return "none";
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
  setPosY(num: number) {
    return this.vector.stopY(num);
  }

  setOnPlatform(posY: number) {
    this.vector.setOnPlatform(posY);
  }
}

export default Player;
