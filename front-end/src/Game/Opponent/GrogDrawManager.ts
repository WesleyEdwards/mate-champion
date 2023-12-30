import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import { DrawInfo } from "../Drawing/drawingUtils";
import oopSprites from "../../assets/opp-1-sprites-1.png";
import { grogConst } from "../constants";

const spriteInfo = {
  forward: 0,
  right: 1,
  left: 2,
  rightAttack: 3,
  leftAttack: 4,
};

export class GrogDrawManager {
  image: HTMLImageElement;

  constructor() {
    this.image = new Image();
    this.image.src = oopSprites;
  }

  draw(drawProps: DrawObjProps, point: Coordinates, sprite: "left") {
    const spritePic = spriteInfo[sprite as keyof typeof spriteInfo];
    if (spritePic === undefined) throw new Error("Sprite not found");

    // const info =
    // typeof spritePic === "number"
    //   ? this.normalSpriteInfo(x, y, spritePic)
    //   : this.spritePicInfo(x, y, spritePic);

    this.drawSpriteImage(drawProps, point);
  }

  drawSpriteImage(
    { cxt, camOffset: camOffset }: DrawObjProps,
    point: Coordinates
  ) {
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";
    cxt.save();
    cxt.translate(point.x - camOffset.x, point.y + camOffset.y);

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

  // spritePicInfo(x: number, y: number, spritePic: SpritePicInfo): DrawInfo {
  //   return {
  //     xOffset: spritePic.x * 32,
  //     yOffset: spritePic.y * 32,
  //     height: spritePic.height * 32,
  //     width: spritePic.width * 32,
  //     spriteHeight: spritePic.height * grogConst.height,
  //     spriteWidth: spritePic.width * grogConst.width,
  //     canvasX: this.canvasX(x, grogConst.width / 2, spritePic.extra),
  //     canvasY: this.canvasY(y, grogConst.height / 2, spritePic.extra),
  //   };
  // }

  // canvasX(
  //   x: number,
  //   extraPics: number,
  //   extra?: "beginX" | "beginY" | "endX" | "endY"
  // ) {
  //   return extra === "beginX" ? x - extraPics : x;
  // }

  // canvasY(
  //   y: number,
  //   extraPics: number,
  //   extra?: "beginX" | "beginY" | "endX" | "endY"
  // ) {
  //   return extra === "beginY" ? y - extraPics : y;
  // }
}
