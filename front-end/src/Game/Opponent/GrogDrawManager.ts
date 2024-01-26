import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import { DrawInfo } from "../Drawing/drawingUtils";
import oopSprites from "../../assets/opp-1-sprites-1.png";
import { grogConst } from "../constants";

export class GrogDrawManager {
  image: HTMLImageElement;

  constructor() {
    this.image = new Image();
    this.image.src = oopSprites;
  }

  draw(
    { cxt, camOffset: camOffset }: DrawObjProps,
    point: Coordinates,
    direction: "left" | "right"
  ) {
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";
    cxt.save();
    cxt.translate(point.x - camOffset.x, point.y + camOffset.y);

    if (direction === "left") {
      cxt.scale(-1, 1);
    }

    cxt.drawImage(
      this.image,
      32, // which sprite
      0,
      32,
      32,
      -0.5 * grogConst.width,
      -0.5 * grogConst.height,
      grogConst.width,
      grogConst.height
    );

    if (devSettings.redOutline) {
      cxt.strokeStyle = "red";
      cxt.lineWidth = 2;
      cxt.strokeRect(
        -0.5 * grogConst.width,
        -0.5 * grogConst.height,
        grogConst.width,
        grogConst.height
      );

      cxt.beginPath();
      cxt.arc(0, 0, 2, 4, 2 * Math.PI);
      cxt.stroke();
    }
    cxt.restore();
  }

  normalSpriteInfo(x: number, y: number, spriteX: number): DrawInfo {
    return {
      xOffset: spriteX * 32,
      yOffset: 0,
      height: 32,
      width: 32,
      spriteHeight: grogConst.height,
      spriteWidth: grogConst.width,
      canvasX: x,
      canvasY: y,
    };
  }
}
