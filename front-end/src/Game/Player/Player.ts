import { levelConst, playerConst } from "../constants";
import { Coordinates, Keys, CharAction, Character } from "../models";
import {
  PlayerAction,
  PlayerMove,
  PlayerVectorManager,
} from "./PlayerVectorManager";
import { DrawObjProps } from "../helpers/types";
import { PlayerDrawManager } from "./PlayerDrawManager";
import { SpriteDisplay } from "./PlayerSpriteInfo";

type NotNone<T> = Exclude<T, "none">;
export class Player implements Character {
  currAction: {
    action: NotNone<PlayerAction>;
    timer: 0;
    cooling: boolean;
  } | null = null;
  vector: PlayerVectorManager = new PlayerVectorManager();
  drawManager: PlayerDrawManager = new PlayerDrawManager();
  onPlatform: boolean = false;

  constructor() {}

  reset() {
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

    const canMoveLeft = this.position.x >= levelConst.playerMinX;

    if (keys.left && canMoveLeft) this.move("MoveLeft");

    if ((!keys.right && !keys.left) || (!canMoveLeft && keys.left)) {
      this.move("StopX");
    }

    if (keys.up || keys.down) {
      this.vector.facingY = keys.up ? "up" : "down";
    } else {
      this.vector.facingY = "none";
    }

    if (this.currAction) this.currAction.timer += elapsedTime;

    this.checkActions(keys);

    this.vector.updateGravity(elapsedTime, keys.jump);
  }

  checkActions(keys: Keys) {
    if (!this.currAction) {
      if (keys.shank || keys.toShank > 0) {
        this.takeAction("melee", keys);
      }

      if (keys.shoot || keys.toShoot > 0) {
        this.takeAction("shoot", keys);
      }
      return;
    }

    if (this.currAction.cooling) {
      const coolDownTime =
        this.currAction.action === "melee"
          ? playerConst.meleeCoolDown
          : playerConst.shootCoolDown;
      if (this.currAction.timer > coolDownTime) {
        this.currAction = null;
      }
      return;
    }

    if (this.currAction.action === "melee") {
      if (this.currAction.timer > playerConst.shankTime) {
        this.setCooling();
      }
      return;
    }
  }

  move(action: CharAction) {
    this.vector.move(action);
  }

  draw(drawProps: DrawObjProps) {
    this.drawManager.draw(
      drawProps,
      this.position,
      this.vector.facingX,
      this.vector.velocity.y > 0
        ? "falling"
        : this.vector.velocity.y < 0
        ? "rising"
        : null,
      this.spriteDisplay
    );
  }

  get spriteDisplay(): SpriteDisplay {
    const move: PlayerMove = this.vector.velocity.x !== 0 ? "walk" : "none";
    const directionY =
      this.vector.facingY === "down" ? "none" : this.vector.facingY;
    const action = (() => {
      if (!this.currAction) return "none";
      if (this.currAction.cooling && this.currAction.action !== "shoot") {
        return "none";
      }
      return this.currAction.action;
    })();
    return `${directionY}-${action}-${move}`;
  }

  get weaponPosCurr(): Coordinates | undefined {
    if (this.currAction?.action !== "melee") return undefined;
    return this.vector.weaponPosCurr;
  }

  takeAction(action: NotNone<PlayerAction>, keys: Keys) {
    this.currAction = { action, timer: 0, cooling: false };
    keys.shank = false;
    keys.toShank = 0;
    keys.shoot = false;
    keys.toShoot = 0;
  }

  get shooting() {
    if (this.currAction?.action === "shoot" && !this.currAction.cooling) {
      this.setCooling();
      return true;
    }
    return false;
  }

  setCooling() {
    if (this.currAction) {
      this.currAction.cooling = true;
      this.currAction.timer = 0;
    }
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
