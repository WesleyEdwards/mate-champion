import { Canvas, DrawObjProps } from "../helpers/types";
import { StaticObject } from "../models";
import { ObjVectorManager } from "../VectorManager/ObjVectorManager";

export type PlatProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export class Platform implements StaticObject {
  color: string;
  vector: ObjVectorManager;
  canMoveBelow: boolean = true;

  constructor({ x, y, width, height, color }: PlatProps) {
    this.vector = new ObjVectorManager({ x, y }, width, height);
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
}
