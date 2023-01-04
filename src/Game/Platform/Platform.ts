import { PLAT_FREQUENCY } from "../constants";
import { StaticObject } from "../models";
import { generateRandomInt } from "../utils";
import { ObjVectorManager } from "../ObjVectorManager";

const PLAT_Y_MIN = 100;
const PLAT_Y_MAX = 576 - 30;
const PLAT_WIDTH_MIN = 200;
const PLAT_WIDTH_MAX = 500;
const TOTAL_HEIGHT = 576;

type PlatPosition = "top" | "middle";

export class Platform implements StaticObject {
  color: string;
  vector: ObjVectorManager;
  canMoveBelow: boolean = true;

  constructor(xPos: number, sectionY: PlatPosition, color?: string) {
    this.vector = new ObjVectorManager(
      {
        x: getXPos(xPos),
        y: getYPos(sectionY),
      },
      generateRandomInt(PLAT_WIDTH_MIN, PLAT_WIDTH_MAX),
      40
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

  // get rightPos() {
  //   return this.vector.posX + this.vector.width;
  // }

  // get posCenter() {
  //   return {
  //     x: this.vector.posX + this.vector.width / 2,
  //     y: this.posTop + this.vector.height / 2,
  //   };
  // }
  // get posTop() {
  //   return this.vector.posY;
  // }
}

export function getYPos(sectionY: PlatPosition) {
  if (sectionY === "top") {
    return generateRandomInt(PLAT_Y_MIN, TOTAL_HEIGHT / 2);
  }
  if (sectionY === "middle") {
    return generateRandomInt(TOTAL_HEIGHT / 2, TOTAL_HEIGHT - 100);
  }

  return PLAT_Y_MAX;
}

export function getXPos(xPos: number) {
  return xPos + generateRandomInt(0, PLAT_FREQUENCY);
}
