import { PLAT_FREQUENCY } from "./constants";
import { Coordinates } from "./models";
import { generateRandomInt } from "./utils";

const PLAT_Y_MIN = 100;
const PLAT_Y_MAX = 576 - 30;
const PLAT_WIDTH_MIN = 200;
const PLAT_WIDTH_MAX = 500;
const TOTAL_HEIGHT = 576;

type PlatPosition = "bottom" | "top" | "middle" | "start";

export class Platform {
  position: Coordinates;
  width: number;
  height: number;
  color: string;

  constructor(xPos: number, sectionY: PlatPosition, color?: string) {
    this.position = {
      x: getXPos(xPos),
      y: getYPos(sectionY),
    };
    this.width = generateRandomInt(PLAT_WIDTH_MIN, PLAT_WIDTH_MAX);
    this.height = 40;
    this.color = color ?? "green";
  }
  draw(canvas: CanvasRenderingContext2D) {
    canvas.fillStyle = this.color;
    canvas.strokeStyle = "black";
    canvas.lineWidth = 8;

    canvas.strokeRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    canvas.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  get rightPos() {
    return this.position.x + this.width;
  }

  get posCenter() {
    return {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
  }
}

export function getYPos(sectionY: PlatPosition) {
  const third = TOTAL_HEIGHT / 3;
  if (sectionY === "top") {
    return generateRandomInt(PLAT_Y_MIN, third);
  }
  if (sectionY === "middle") {
    return generateRandomInt(third, 2 * third);
  }
  if (sectionY === "bottom") {
    return generateRandomInt(2 * third, PLAT_Y_MAX);
  }

  return PLAT_Y_MAX;
}

export function getXPos(xPos: number) {
  return xPos + generateRandomInt(0, PLAT_FREQUENCY);
}
