import { devSettings } from "../devSettings";
import { DrawObjProps } from "../helpers/types";
import { Coordinates } from "../models";
import champIdle from "../../assets/champ/idle.png";
import champMelee from "../../assets/champ/melee_attacks.png";
import champWalk from "../../assets/champ/walking.png";
import champJump from "../../assets/champ/jumping.png";
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
const imageSources: Record<string, string> = {
  champIdle: champIdle,
  champMelee: champMelee,
  champWalk: champWalk,
  champJump: champJump,
};

export type SpriteDisplay = `${Exclude<
  PlayerDirectionY,
  "down"
>}-${PlayerAction}-${Exclude<PlayerMove, "jump">}`;

type ImageInfo = {
  image: string;
  imgCount: number;
  startX: number;
  cycleTime: number;
};

const spritesInfo: Record<SpriteDisplay, ImageInfo | undefined> = {
  "none-none-none": {
    image: "champIdle",
    imgCount: 4,
    startX: 0,
    cycleTime: 1000,
  },
  "none-none-walk": {
    image: "champWalk",
    imgCount: 8,
    startX: 0,
    cycleTime: 100,
  },
  "none-shoot-none": undefined,
  "none-shoot-walk": undefined,
  "none-melee-none": {
    image: "champMelee",
    imgCount: 5,
    startX: 0,
    cycleTime: playerConst.shankTime / 5,
  },
  "none-melee-walk": undefined,

  "up-none-none": {
    image: "champIdle",
    imgCount: 1,
    startX: 8,
    cycleTime: 1000,
  },
  "up-none-walk": undefined,
  "up-shoot-none": undefined,
  "up-shoot-walk": undefined,
  "up-melee-none": {
    image: "champMelee",
    imgCount: 5,
    startX: 10,
    cycleTime: playerConst.shankTime / 5,
  },
  "up-melee-walk": undefined,
};

const spriteJumping: Record<"rising" | "falling", ImageInfo> = {
  rising: {
    image: "champJump",
    imgCount: 1,
    startX: 0,
    cycleTime: 100,
  },
  falling: {
    image: "champJump",
    imgCount: 1,
    startX: 1,
    cycleTime: 100,
  },
};

const drawImageWidth = 300; // this allows room for the attacks to be drawn
const drawImageHeight = drawImageWidth * (105 / 200);

export class PlayerDrawManager {
  // image: HTMLImageElement = new Image();

  imageWidth = 28;
  spriteTimer: number = 0;
  prevAction: SpriteDisplay = "none-none-none";
  images: Record<string, HTMLImageElement>;

  constructor() {
    this.images = Object.entries(imageSources).reduce((acc, [k, v]) => {
      const i = new Image();
      i.src = v;
      acc[k] = i;
      return acc;
    }, {} as Record<string, HTMLImageElement>);
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
      if (inAir) {
        return spriteJumping[inAir];
      }
      return spritesInfo[sprite];
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
