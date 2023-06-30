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
  }

  draw(point: Coordinates, sprite: SpriteOption) {
    this.context.save();
    const { x, y } = point;
    const spritePic = this.spriteInfo[sprite];
    if (spritePic === undefined) throw new Error("Sprite not found");

    if (isSpritePicInfo(spritePic)) {
      const spriteXOffset = spritePic.x * 32;
      const spriteYOffset = spritePic.y * 32;
      const spriteHeight = spritePic.height * 32;

      this.context.drawImage(
        this.image,
        spriteXOffset,
        spriteYOffset,
        32,
        32,
        x,
        y,
        this.image.width,
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
}
