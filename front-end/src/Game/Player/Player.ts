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

export type CurrentChampAction = {
  action: NotNone<PlayerAction>;
  timer: 0;
  cooling: boolean;
};
export class Player implements Character {
  currAction: CurrentChampAction | null = null;
  vector: PlayerVectorManager = new PlayerVectorManager();
  drawManager: PlayerDrawManager = new PlayerDrawManager();
  onPlatform: boolean = false;

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
    this.drawManager.drawFromPlayerInfo(
      drawProps,
      this.vector,
      this.currAction
    );

    if (this.weaponPosCurr) {
      drawProps.cxt.save();
      drawProps.cxt.fillStyle = "blue";
      drawProps.cxt.translate(
        this.weaponPosCurr.x - drawProps.camOffset.x,
        this.weaponPosCurr.y + drawProps.camOffset.y
      );
      drawProps.cxt.beginPath();
      drawProps.cxt.arc(0, 0, 1, 0, 2 * Math.PI);
      drawProps.cxt.stroke();
      drawProps.cxt.restore();
    }
  }

  get weaponPosCurr(): Coordinates | undefined {
    if (!this.currAction) return undefined;
    if (this.currAction.cooling) return undefined;
    if (this.currAction.action !== "melee") return undefined;
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

  setOnPlatform(posY: number) {
    this.vector.setOnPlatform(posY);
  }
}

export default Player;
