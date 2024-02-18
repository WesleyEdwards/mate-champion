import { GRAVITY, MAX_CANVAS_HEIGHT, grogConst } from "../constants";
import { Character, OppDirections, CharAction, Coordinates } from "../models";
import { randomOutOf } from "../helpers/utils";
import { OpponentVectorManager } from "./OpponentVectorManager";
import { DrawObjProps } from "../helpers/types";
import { GrogDrawManager } from "./GrogDrawManager";

export type GrogProps = {
  initPos: Coordinates;
  moveSpeed: number;
  jumpOften?: boolean;
};

export class Grog implements Character {
  vector: OpponentVectorManager;
  drawManager: GrogDrawManager;
  jumpOften: boolean;
  dyingState: "alive" | "dying" | "dead" = "alive";
  dyingTimer: number = 0;

  constructor({ initPos, moveSpeed, jumpOften }: GrogProps) {
    this.vector = new OpponentVectorManager(
      { ...initPos },
      moveSpeed,
      grogConst.width / 2
    );
    this.drawManager = new GrogDrawManager();
    this.jumpOften = !!jumpOften;
  }

  update(elapsedTime: number) {
    this.vector.update(elapsedTime);
    this.drawManager.update(elapsedTime);
    this.velocity.y += GRAVITY * elapsedTime;

    if (this.bottomPos > MAX_CANVAS_HEIGHT) {
      this.vector.stopY(MAX_CANVAS_HEIGHT - this.height / 2);
    }

    if (randomOutOf(120)) this.move("MoveRight");
    if (randomOutOf(120)) this.move("MoveLeft");
    if (this.dyingState === "alive" && randomOutOf(this.jumpOften ? 50 : 120)) {
      this.move("Jump");
    }
    if (this.dyingState === "dying") {
      this.dyingTimer += elapsedTime;
      if (this.dyingTimer > 500) this.dyingState = "dead";
    }
  }
  move(action: CharAction) {
    this.vector.move(action);
  }

  draw(drawProps: DrawObjProps) {
    this.drawManager.drawFromInfo(drawProps, this.vector, this.dyingState !== "alive");
  }

  setOnPlatform(num: number) {
    return this.vector.stopY(num);
  }

  markAsDying() {
    this.dyingState = "dying";
    this.drawManager.spriteTimer = 0;
  }

  get bottomPos() {
    return this.position.y + this.height;
  }

  get height() {
    return this.vector.height;
  }

  get position() {
    return this.vector.position;
  }

  get velocity() {
    return this.vector.velocity;
  }

  get facing(): OppDirections {
    if (this.vector.velocity.x > 0) return "right";
    return "left";
  }

  get moveDown() {
    return false;
  }
}
