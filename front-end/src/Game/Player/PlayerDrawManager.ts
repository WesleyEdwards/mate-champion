import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import {
  DrawInfo,
  SpriteMap,
  SpriteOption,
  SpritePicInfo,
} from "../Drawing/drawingUtils";
import playerSprites from "../../assets/mate-player.png";
import { playerConst } from "../constants";

const spriteInfo: SpriteMap = {
  right: 0,
  left: 1,
  rightUp: 2,
  leftUp: 3,
  rightAttack: { x: 4, y: 0, height: 1, width: 1.5 },
  leftAttack: { x: 5.5, y: 0, height: 1, width: 1.5, extra: "beginX" },
  rightUpAttack: { x: 0, y: 1, height: 1.5, width: 1, extra: "beginY" },
  leftUpAttack: { x: 1, y: 1, height: 1.5, width: 1, extra: "beginY" },
};

export class PlayerDrawManager {
  image: HTMLImageElement;

  constructor() {
    this.image = new Image();
    this.image.src = playerSprites;
    this.image.width = this.widthHeight;
    this.image.height = this.widthHeight;
  }

  draw(drawProps: DrawObjProps, point: Coordinates, sprite: SpriteOption) {
    const { x, y } = point;

    const spritePic = spriteInfo[sprite];
    if (spritePic === undefined) throw new Error("Sprite not found");

    const info =
      typeof spritePic === "number"
        ? this.normalSpriteInfo(x, y, spritePic)
        : this.spritePicInfo(x, y, spritePic);

    this.drawSpriteImage(drawProps, info);
  }

  drawSpriteImage({ cxt, camOffset: camOffset }: DrawObjProps, info: DrawInfo) {
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";
    // this.context.save();
    cxt.drawImage(
      this.image,
      info.xOffset,
      info.yOffset,
      info.width,
      info.height,
      info.canvasX - camOffset.x,
      info.canvasY + 1 + camOffset.y,
      info.spriteWidth,
      info.spriteHeight
    );

    if (devSettings.redOutline) {
      cxt.strokeStyle = "red";
      cxt.lineWidth = 2;
      cxt.strokeRect(
        info.canvasX - camOffset.x,
        info.canvasY + 1 + camOffset.y,
        info.spriteWidth,
        info.spriteHeight
      );
    }
    // this.context.restore();
  }

  normalSpriteInfo(x: number, y: number, spriteX: number): DrawInfo {
    return {
      xOffset: spriteX * 32,
      yOffset: 0,
      height: 32,
      width: 32,
      spriteHeight: this.widthHeight,
      spriteWidth: this.widthHeight,
      canvasX: x,
      canvasY: y,
    };
  }

  spritePicInfo(x: number, y: number, spritePic: SpritePicInfo): DrawInfo {
    return {
      xOffset: spritePic.x * 32,
      yOffset: spritePic.y * 32,
      height: spritePic.height * 32,
      width: spritePic.width * 32,
      spriteHeight: spritePic.height * this.widthHeight,
      spriteWidth: spritePic.width * this.widthHeight,
      canvasX: this.canvasX(x, this.widthHeight / 2, spritePic.extra),
      canvasY: this.canvasY(y, this.widthHeight / 2, spritePic.extra),
    };
  }

  canvasX(
    x: number,
    extraPics: number,
    extra?: "beginX" | "beginY" | "endX" | "endY"
  ) {
    return extra === "beginX" ? x - extraPics : x;
  }

  canvasY(
    y: number,
    extraPics: number,
    extra?: "beginX" | "beginY" | "endX" | "endY"
  ) {
    return extra === "beginY" ? y - extraPics : y;
  }

  get widthHeight() {
    return playerConst.radius * 2;
  }
}
