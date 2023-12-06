import { StaticObject } from "../models";
import { ObjVectorManager } from "../VectorManager/ObjVectorManager";

const PLAT_Y_MIN = 100;
const PLAT_Y_MAX = 576 - 30;
const PLAT_WIDTH_MIN = 200;
const PLAT_WIDTH_MAX = 500;
const TOTAL_HEIGHT = 576;

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

  draw(canvas: CanvasRenderingContext2D) {
    canvas.fillStyle = this.color;
    canvas.strokeStyle = "black";
    canvas.lineWidth = 8;

    canvas.strokeRect(
      this.vector.posX,
      this.vector.posY + 4,
      this.vector.width,
      this.vector.height
    );
    canvas.fillRect(
      this.vector.posX,
      this.vector.posY + 4,
      this.vector.width,
      this.vector.height
    );
  }
}
