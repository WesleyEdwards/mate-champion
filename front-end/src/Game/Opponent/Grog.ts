import { GRAVITY, MAX_CANVAS_HEIGHT, grogConst } from "../constants";
import { Character, OppDirections, CharAction, Coordinates } from "../models";
import { randomOutOf } from "../helpers/utils";
import { OpponentVectorManager } from "./OpponentVectorManager";
import { DrawObjProps } from "../helpers/types";
import { devSettings } from "../devSettings";
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
    if (devSettings.courseBuilder) return;
    this.vector.update(elapsedTime);
    this.velocity.y += GRAVITY * elapsedTime;

    if (this.bottomPos > MAX_CANVAS_HEIGHT) {
      this.vector.stopY(MAX_CANVAS_HEIGHT - this.height / 2);
    }

    if (randomOutOf(this.jumpOften ? 50 : 120)) this.move("Jump");
    if (randomOutOf(120)) this.move("MoveRight");
    if (randomOutOf(120)) this.move("MoveLeft");
  }
  move(action: CharAction) {
    this.vector.move(action);
  }

  draw(drawProps: DrawObjProps) {
    this.drawManager.drawFromInfo(drawProps, this.vector);
  }

  setOnPlatform(num: number) {
    return this.vector.stopY(num);
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
