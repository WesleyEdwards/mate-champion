import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import { playerConst } from "../constants";
import { debounceLog } from "../helpers/utils";
import {
  PlayerDirectionX,
  PlayerDirectionY,
  PlayerAction,
  PlayerMove,
} from "./PlayerVectorManager";
import {
  ImageSource,
  SpriteDisplay,
  playerSpriteImages,
  playerSpriteJumping,
  playerSpritesInfo,
} from "./PlayerSpriteInfo";

const drawImageWidth = 300; // this allows room for the attacks to be drawn
const drawImageHeight = drawImageWidth * (105 / 200);

export class PlayerDrawManager {
  // image: HTMLImageElement = new Image();

  imageWidth = 28;
  spriteTimer: number = 0;
  prevAction: SpriteDisplay = "none-none-none";
  images: Record<ImageSource, HTMLImageElement>;

  constructor() {
    this.images = playerSpriteImages;
  }
  update(elapsedTime: number) {
    this.spriteTimer += elapsedTime;
  }

  draw(
    { cxt, camOffset: camOffset }: DrawObjProps,
    point: Coordinates,
    directionX: PlayerDirectionX,
    inAir: "rising" | "falling" | null,
    sprite: SpriteDisplay
  ) {
    if (this.prevAction !== sprite) {
      this.spriteTimer = 0;
    }

    this.prevAction = sprite;

    const spriteInfo = (() => {
      if (inAir && !sprite.includes("melee")) {
        return playerSpriteJumping[inAir];
      }
      return playerSpritesInfo[sprite];
    })();

    if (!spriteInfo) {
      console.log("Action has not yet been defined");
      return;
    }

    const whichSprite =
      Math.round(this.spriteTimer / spriteInfo.cycleTime) % spriteInfo.imgCount;
    const imageWidth = 200;

    cxt.save();
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";

    cxt.translate(point.x - camOffset.x, point.y + camOffset.y);

    if (directionX === "left") {
      cxt.scale(-1, 1);
    }

    const image = this.images[spriteInfo.image];

    cxt.drawImage(
      image,
      imageWidth * whichSprite + spriteInfo.startX * imageWidth,
      0,
      imageWidth,
      image.height,
      -drawImageWidth / 2,
      -(drawImageHeight - playerConst.radius),
      drawImageWidth,
      drawImageHeight
    );

    if (devSettings.redOutline) {
      cxt.strokeStyle = "red";
      cxt.beginPath();
      cxt.arc(0, 0, 1, 0, 2 * Math.PI);
      cxt.stroke();
      cxt.lineWidth = 2;
      cxt.strokeRect(
        -playerConst.radius,
        -playerConst.radius,
        playerConst.radius * 2,
        playerConst.radius * 2
      );
    }
    cxt.restore();
  }

  get widthHeight() {
    return playerConst.radius * 2;
  }
}
