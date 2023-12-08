import { MAX_CANVAS_HEIGHT } from "../constants";
import { DrawObjProps } from "../helpers/types";
import { StaticObject } from "../models";
import { ObjVectorManager } from "../VectorManager/ObjVectorManager";
import { PlatProps } from "./Platform";

export class Floor implements StaticObject {
  color: string;
  vector: ObjVectorManager;
  canMoveBelow: boolean = false;

  constructor({ x, y, width, color }: PlatProps) {
    this.vector = new ObjVectorManager({ x, y }, width, 60);
    this.color = color;
  }

  draw({ cxt, offsetX }: DrawObjProps) {
    cxt.fillStyle = this.color;
    cxt.strokeStyle = "black";
    cxt.lineWidth = 8;

    cxt.strokeRect(
      this.vector.posX - offsetX,
      this.vector.posY + 4,
      this.vector.width,
      this.vector.height
    );
    cxt.fillRect(
      this.vector.posX - offsetX,
      this.vector.posY + 4,
      this.vector.width,
      this.vector.height
    );
  }

  get rightPos() {
    return this.vector.posX + this.vector.width;
  }

  get posCenter() {
    return {
      x: this.vector.posX + this.vector.width / 2,
      y: this.posTop + this.vector.height / 2,
    };
  }
  get posTop() {
    return this.vector.posY;
  }
}
