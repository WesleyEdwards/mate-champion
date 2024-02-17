import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import { DrawInfo } from "../Drawing/drawingUtils";
import { grogConst } from "../constants";
import enemyDeath from "../../assets/grog/enemy_death.png";
import enemyJump from "../../assets/grog/enemy_jump_and_fall.png";
import enemyWalking from "../../assets/grog/enemy_walking.png";
import { SpriteInfo, getSpriteImages } from "../Player/PlayerSpriteInfo";
import { OpponentVectorManager } from "./OpponentVectorManager";

type GrogImageSource = "enemyDeath" | "enemyJump" | "enemyWalking";

const drawImageWidth = 150; // this allows room for the attacks to be drawn
const drawImageHeight = drawImageWidth * (105 / 200);

const imageSources: Record<GrogImageSource, string> = {
  enemyDeath,
  enemyJump,
  enemyWalking,
};

type GrogDescription = "walk" | "die";

export class GrogDrawManager {
  images: Record<GrogImageSource, HTMLImageElement> =
    getSpriteImages(imageSources);
  spriteTimer: number = 0;

  update(elapsedTime: number) {
    this.spriteTimer += elapsedTime;
  }
  drawFromInfo(drawProps: DrawObjProps, vector: OpponentVectorManager) {
    const inAir =
      vector.velocity.y > 0
        ? "falling"
        : vector.velocity.y < 0
        ? "rising"
        : null;

    const facingX = vector.velocity.x > 0 ? "right" : "left";

    const spriteDisplay = "walk";
    // const spriteDisplay = Math.abs(vector.velocity.y) > 0 ? "jump" : "walk";
    this.draw(drawProps, vector.position, facingX, inAir, spriteDisplay);
  }
  draw(
    { cxt, camOffset: camOffset }: DrawObjProps,
    point: Coordinates,
    directionX: "left" | "right",
    inAir: "rising" | "falling" | null,
    sprite: GrogDescription
  ) {
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";
    cxt.save();
    cxt.translate(point.x - camOffset.x, point.y + camOffset.y);

    const spriteInfo = inAir
      ? grogSpriteJumping[inAir]
      : grogSpritesInfo[sprite];

    if (!spriteInfo) {
      return console.error("No sprite info provided");
    }

    const whichSprite =
      Math.round(this.spriteTimer / spriteInfo.cycleTime) % spriteInfo.imgCount;
    const imageWidth = 75;

    if (directionX === "left") {
      cxt.scale(-1, 1);
    }

    const image = this.images[spriteInfo.image];

    cxt.drawImage(
      image,
      imageWidth * whichSprite + spriteInfo.startX * imageWidth, // which sprite
      0,
      imageWidth,
      image.height,
      -drawImageWidth / 2,
      -(drawImageHeight - grogConst.width / 2),
      drawImageWidth,
      drawImageHeight
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

const grogSpritesInfo: SpriteInfo<GrogDescription, GrogImageSource> = {
  walk: {
    image: "enemyWalking",
    imgCount: 6,
    startX: 0,
    cycleTime: 120,
  },
  die: {
    image: "enemyDeath",
    imgCount: 4,
    startX: 0,
    cycleTime: 70,
  },
};

export const grogSpriteJumping: SpriteInfo<
  "rising" | "falling",
  GrogImageSource
> = {
  rising: {
    image: "enemyJump",
    imgCount: 1,
    startX: 0,
    cycleTime: 100,
  },
  falling: {
    image: "enemyJump",
    imgCount: 1,
    startX: 1,
    cycleTime: 100,
  },
};
