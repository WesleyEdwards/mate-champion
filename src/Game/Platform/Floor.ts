import { MAX_CANVAS_HEIGHT } from "../constants";
import { StaticObject } from "../models";
import { ObjVectorManager } from "../VectorManager/ObjVectorManager";

export class Floor implements StaticObject {
  color: string;
  vector: ObjVectorManager;
  canMoveBelow: boolean = false;

  constructor(xPos: number, width: number, color?: string) {
    this.vector = new ObjVectorManager(
      {
        x: xPos,
        y: MAX_CANVAS_HEIGHT - 50,
      },
      width,
      60
    );
    this.color = color ?? "green";
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
