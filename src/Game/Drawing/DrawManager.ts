import { Coordinates } from "../models";
import {
  Drawable,
  SpriteMap,
  SpriteOption,
  SpritePicInfo,
  drawableMap,
  spriteMap,
} from "./drawingUtils";

type DrawInfo = {
  xOffset: number; // Where on the sprite image the start of the image is
  yOffset: number;
  width: number; // how much of the sprite sheet shows (64 will show two images squished into one)
  height: number;
  canvasX: number; // Where on the canvas the image will be drawn
  canvasY: number;
  spriteWidth: number; // How big the image will be drawn
  spriteHeight: number;
};

export class DrawManager {
  image: HTMLImageElement;
  spriteInfo: SpriteMap;
  width: number;
  height: number;

  constructor(drawable: Drawable, width: number, height: number) {
    this.image = new Image();
    this.image.src = drawableMap[drawable];
    this.image.width = width;
    this.image.height = height;
    this.spriteInfo = spriteMap[drawable];
    this.width = width;
    this.height = height;
  }

  draw(
    cxt: CanvasRenderingContext2D,
    point: Coordinates,
    sprite: SpriteOption
  ) {
    const { x, y } = point;

    const spritePic = this.spriteInfo[sprite];
    if (spritePic === undefined) throw new Error("Sprite not found");

    const info =
      typeof spritePic === "number"
        ? this.normalSpriteInfo(x, y, spritePic)
        : this.spritePicInfo(x, y, spritePic);

    this.drawSpriteImage(cxt, info);
  }

  drawSpriteImage(cxt: CanvasRenderingContext2D, info: DrawInfo) {
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";
    // this.context.save();
    cxt.drawImage(
      this.image,
      info.xOffset,
      info.yOffset,
      info.width,
      info.height,
      info.canvasX,
      info.canvasY + 1,
      info.spriteWidth,
      info.spriteHeight
    );
    // this.context.restore();
  }

  normalSpriteInfo(x: number, y: number, spriteX: number): DrawInfo {
    return {
      xOffset: spriteX * 32,
      yOffset: 0,
      height: 32,
      width: 32,
      spriteHeight: this.height,
      spriteWidth: this.width,
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
      spriteHeight: spritePic.height * this.height,
      spriteWidth: spritePic.width * this.width,
      canvasX: this.canvasX(x, this.width / 2, spritePic.extra),
      canvasY: this.canvasY(y, this.height / 2, spritePic.extra),
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
}
