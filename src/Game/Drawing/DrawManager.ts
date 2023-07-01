import { Coordinates } from "../models";
import {
  Drawable,
  SpriteMap,
  SpriteOption,
  drawableMap,
  isSpritePicInfo,
  spriteMap,
} from "./drawingUtils";

export class DrawManager {
  image: HTMLImageElement;
  context: CanvasRenderingContext2D;
  spriteInfo: SpriteMap;
  width: number;
  height: number;

  constructor(
    context: CanvasRenderingContext2D,
    drawable: Drawable,
    width: number,
    height: number
  ) {
    this.image = new Image();
    this.image.src = drawableMap[drawable];
    this.image.width = width;
    this.image.height = height;
    this.context = context;
    this.spriteInfo = spriteMap[drawable];
    this.width = width;
    this.height = height;
  }

  draw(point: Coordinates, sprite: SpriteOption) {
    this.context.save();
    const { x, y } = point;

    const spritePic = this.spriteInfo[sprite];
    if (spritePic === undefined) throw new Error("Sprite not found");

    if (isSpritePicInfo(spritePic)) {
      // const canvasX = x - (spritePic.width * this.width - this.width) / 2;
      // const canvasY = y - (spritePic.height * this.height - this.height) / 2;

      const xOffset = spritePic.x * 32;
      const yOffset = spritePic.y * 32;
      const height = spritePic.height * 32;
      const width = spritePic.width * 32;
      const spriteHeight = spritePic.height * this.height;
      const spriteWidth = spritePic.width * this.width;

      const canvasX = this.canvasX(x, this.width / 2, spritePic.extra);
      const canvasY = this.canvasY(y, this.height / 2, spritePic.extra);

      // if (spritePic.extra === "beginX") {
      //   console.log("beginX", x, width - 32, canvasX);
      // }

      this.context.drawImage(
        this.image,
        xOffset,
        yOffset,
        width,
        height,
        canvasX,
        canvasY,
        spriteWidth,
        spriteHeight
      );
    } else {
      const spriteXOffset = spritePic * 32;
      this.context.drawImage(
        this.image,
        spriteXOffset, // x-offset, which sprite is going to show.
        0,
        32, // how much of the sprite sheet shows (64 will show two images squished into one)
        32, // same as above, bug height. Squishes the image into the top half if doubled.
        x,
        y,
        this.image.width,
        this.image.height
      );
    }
    // this.context.strokeStyle = "red";
    // this.context.lineWidth = 2;
    // this.context.strokeRect(x, y, this.image.width, this.image.height);
    this.context.restore();
  }

  canvasX(
    x: number,
    extraPics: number,
    extra?: "beginX" | "beginY" | "endX" | "endY"
  ) {
    // if (extra === "beginX") {
    //   console.log("beginX", x, extraPics);
    // }
    return extra === "beginX" ? x - extraPics - 2 : x;
  }

  canvasY(
    y: number,
    extraPics: number,
    extra?: "beginX" | "beginY" | "endX" | "endY"
  ) {
    return extra === "beginY" ? y - extraPics : y;
  }
}
