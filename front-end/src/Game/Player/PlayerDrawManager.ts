import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import champIdle from "../../assets/champ/idle.png";
import champMelee from "../../assets/champ/melee_attacks.png";
import champWalk from "../../assets/champ/walking.png";
import { playerConst } from "../constants";
import { debounceLog } from "../helpers/utils";
import {
  PlayerDirectionX,
  PlayerDirectionY,
  PlayerAction,
  PlayerMove,
} from "./PlayerVectorManager";

// const spriteInfo: SpriteMap = {
//   right: 0,
//   left: 1,
//   rightUp: 2,
//   leftUp: 3,
//   rightAttack: { x: 4, y: 0, height: 1, width: 1.5 },
//   leftAttack: { x: 5.5, y: 0, height: 1, width: 1.5, extra: "beginX" },
//   rightUpAttack: { x: 0, y: 1, height: 1.5, width: 1, extra: "beginY" },
//   leftUpAttack: { x: 1, y: 1, height: 1.5, width: 1, extra: "beginY" },
// };

// left right up down
// shoot melee
// jump walk
//

export type SpriteDisplay =
  `${PlayerDirectionX}-${PlayerDirectionY}-${PlayerAction}-${PlayerMove}`;

type ImageInfo = {
  image: string;
  imgCount: number;
  startX: number;
  cycleTime: number;
};

const spritesInfo: Record<SpriteDisplay, ImageInfo | undefined> = {
  "right-none-none-none": {
    image: champIdle,
    imgCount: 4,
    startX: 0,
    cycleTime: 1000,
  },
  "right-none-none-walk": {
    image: champWalk,
    imgCount: 8,
    startX: 0,
    cycleTime: 100,
  },
  "right-none-shoot-none": undefined,
  "right-none-shoot-walk": undefined,
  "right-none-melee-none": {
    image: champMelee,
    imgCount: 5,
    startX: 0,
    cycleTime: playerConst.shankTime / 5,
  },
  "right-none-melee-walk": undefined,

  "right-up-none-none": {
    image: champIdle,
    imgCount: 1,
    startX: 8,
    cycleTime: 1000,
  },
  "right-up-none-walk": undefined,
  "right-up-shoot-none": undefined,
  "right-up-shoot-walk": undefined,
  "right-up-melee-none": {
    image: champMelee,
    imgCount: 5,
    startX: 10,
    cycleTime: playerConst.shankTime / 5,
  },
  "right-up-melee-walk": undefined,

  "right-down-none-none": undefined,
  "right-down-none-walk": undefined,
  "right-down-shoot-none": undefined,
  "right-down-shoot-walk": undefined,
  "right-down-melee-none": undefined,
  "right-down-melee-walk": undefined,

  "left-none-none-none": {
    image: champIdle,
    imgCount: 4,
    startX: 4,
    cycleTime: 1000,
  },
  "left-none-none-walk": {
    image: champWalk,
    imgCount: 8,
    startX: 8,
    cycleTime: 100,
  },
  "left-none-shoot-none": undefined,
  "left-none-shoot-walk": undefined,
  "left-none-melee-none": {
    image: champMelee,
    imgCount: 5,
    startX: 5,
    cycleTime: playerConst.shankTime / 5,
  },
  "left-none-melee-walk": undefined,

  "left-up-none-none": {
    image: champIdle,
    imgCount: 1,
    startX: 9,
    cycleTime: 1000,
  },
  "left-up-none-walk": undefined,
  "left-up-shoot-none": undefined,
  "left-up-shoot-walk": undefined,
  "left-up-melee-none": {
    image: champMelee,
    imgCount: 5,
    startX: 15,
    cycleTime: playerConst.shankTime / 5,
  },
  "left-up-melee-walk": undefined,

  "left-down-none-none": undefined,
  "left-down-none-walk": undefined,
  "left-down-shoot-none": undefined,
  "left-down-shoot-walk": undefined,
  "left-down-melee-none": undefined,
  "left-down-melee-walk": undefined,
  "left-up-none-jump": undefined,
  "left-up-shoot-jump": undefined,
  "left-up-melee-jump": undefined,
  "left-down-none-jump": undefined,
  "left-down-shoot-jump": undefined,
  "left-down-melee-jump": undefined,
  "left-none-none-jump": undefined,
  "left-none-shoot-jump": undefined,
  "left-none-melee-jump": undefined,
  "right-up-none-jump": undefined,
  "right-up-shoot-jump": undefined,
  "right-up-melee-jump": undefined,
  "right-down-none-jump": undefined,
  "right-down-shoot-jump": undefined,
  "right-down-melee-jump": undefined,
  "right-none-none-jump": undefined,
  "right-none-shoot-jump": undefined,
  "right-none-melee-jump": undefined
};

const drawImageWidth = 300; // this allows room for the attacks to be drawn
const drawImageHeight = drawImageWidth * (105 / 200);

export class PlayerDrawManager {
  image: HTMLImageElement = new Image();
  imageWidth = 28;
  spriteTimer: number = 0;

  update(elapsedTime: number) {
    this.spriteTimer += elapsedTime;
  }

  draw(
    { cxt, camOffset: camOffset }: DrawObjProps,
    point: Coordinates,
    sprite: SpriteDisplay
  ) {
    const spriteInfo = spritesInfo[sprite];

    if (!spriteInfo) {
      console.log("Action has not yet been defined");
      return;
    }

    this.image.src = spriteInfo.image;

    const whichSprite =
      Math.round(this.spriteTimer / spriteInfo.cycleTime) % spriteInfo.imgCount;
    const imageWidth = 200;

    cxt.save();
    cxt.imageSmoothingEnabled = false;
    cxt.imageSmoothingQuality = "high";

    cxt.translate(point.x - camOffset.x, point.y + camOffset.y);
    cxt.drawImage(
      this.image,
      imageWidth * whichSprite + spriteInfo.startX * imageWidth,
      0,
      imageWidth,
      this.image.height,
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

  // normalSpriteInfo(x: number, y: number, spriteX: number): DrawInfo {
  //   return {
  //     xOffset: spriteX * 32,
  //     yOffset: 0,
  //     height: 32,
  //     width: 32,
  //     spriteHeight: this.widthHeight,
  //     spriteWidth: this.widthHeight,
  //     canvasX: x,
  //     canvasY: y,
  //   };
  // }

  // spritePicInfo(x: number, y: number, spritePic: SpritePicInfo): DrawInfo {
  //   return {
  //     xOffset: spritePic.x * 32,
  //     yOffset: spritePic.y * 32,
  //     height: spritePic.height * 32,
  //     width: spritePic.width * 32,
  //     spriteHeight: spritePic.height * this.widthHeight,
  //     spriteWidth: spritePic.width * this.widthHeight,
  //     canvasX: this.canvasX(x, this.widthHeight / 2, spritePic.extra),
  //     canvasY: this.canvasY(y, this.widthHeight / 2, spritePic.extra),
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

  get widthHeight() {
    return playerConst.radius * 2;
  }
}
