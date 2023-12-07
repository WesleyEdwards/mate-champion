import { BulletVector } from "./BulletVector";
import { makeImage, MCImage } from "../Drawing/drawingUtils";
import { Coordinates, HasPosition, VagueFacing } from "../models";
import { bulletImageType } from "./BulletDrawer";
import { bulletConst } from "../constants";

export class Bullet implements HasPosition {
  vector: BulletVector;
  position: Coordinates;
  velocity: Coordinates;
  imageType: bulletImageType;

  constructor(pos: Coordinates, direction: VagueFacing) {
    this.vector = new BulletVector(pos);
    this.position = pos;
    this.velocity = getDirection(direction);
    this.imageType = calcImage(direction);
  }

  update(elapsedTime: number) {
    this.position.x += this.velocity.x * elapsedTime;
    this.position.y += this.velocity.y * elapsedTime;
  }

  get posCenter() {
    return {
      x: this.position.x + bulletConst.radius,
      y: this.position.y + bulletConst.radius,
    };
  }
}

function getDirection(dir: VagueFacing): Coordinates {
  if (dir === "left") return { x: -bulletConst.speed, y: 0 };
  if (dir === "right") return { x: bulletConst.speed, y: 0 };
  return { x: 0, y: -bulletConst.speed };
}

function calcImage(dir: VagueFacing): bulletImageType {
  if (dir === "left" || dir === "right") return "bulletHor";
  return "bulletVert";
}
