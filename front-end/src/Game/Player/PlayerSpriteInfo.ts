import { playerConst } from "../constants";
import champIdle from "../../assets/champ/idle.png";
import champMelee from "../../assets/champ/melee_attacks.png";
import champWalk from "../../assets/champ/walking.png";
import champJump from "../../assets/champ/jumping.png";
import champRange from "../../assets/champ/ranged_attacks.png";
import champUpLookWalk from "../../assets/champ/uplook_walking.png";
import {
  PlayerDirectionY,
  PlayerAction,
  PlayerMove,
} from "./PlayerVectorManager";

export function getSpriteImages<T extends string>(
  source: Record<T, string>
): Record<T, HTMLImageElement> {
  return Object.entries(source).reduce((acc, [k, v]) => {
    const i = new Image();
    i.src = v as string;
    acc[k as T] = i;
    return acc;
  }, {} as Record<T, HTMLImageElement>);
}

export type PlayerImageSource =
  | "champIdle"
  | "champMelee"
  | "champWalk"
  | "champUpLookWalk"
  | "champJump"
  | "champRange";

const imageSources: Record<PlayerImageSource, string> = {
  champIdle: champIdle,
  champMelee: champMelee,
  champWalk: champWalk,
  champJump: champJump,
  champRange: champRange,
  champUpLookWalk: champUpLookWalk,
};

export const playerSpriteImages = getSpriteImages(imageSources);

export type PlayerDescription = `${Exclude<
  PlayerDirectionY,
  "down"
>}-${PlayerAction}-${Exclude<PlayerMove, "jump">}`;

export type ImageInfo<T extends string> = {
  image: T;
  imgCount: number;
  startX: number;
  cycleTime: number;
};

const walkCycleTime = 70;

export type SpriteInfo<
  DESCRIPTION extends string,
  IMAGE_REF extends string
> = Record<DESCRIPTION, ImageInfo<IMAGE_REF> | undefined>;

export const playerSpritesInfo: SpriteInfo<
  PlayerDescription,
  PlayerImageSource
> = {
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
    cycleTime: walkCycleTime,
  },
  "none-shoot-none": {
    image: "champRange",
    imgCount: 6,
    startX: 0,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "none-shoot-walk": {
    image: "champRange",
    imgCount: 6,
    startX: 0,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "none-melee-none": {
    image: "champMelee",
    imgCount: 5,
    startX: 0,
    cycleTime: playerConst.shankTime / 5,
  },
  "none-melee-walk": {
    image: "champMelee",
    imgCount: 5,
    startX: 0,
    cycleTime: playerConst.shankTime / 5,
  },

  "up-none-none": {
    image: "champIdle",
    imgCount: 1,
    startX: 8,
    cycleTime: 1000,
  },
  "up-none-walk": {
    image: "champUpLookWalk",
    imgCount: 8,
    startX: 0,
    cycleTime: walkCycleTime,
  },
  "up-shoot-none": {
    image: "champRange",
    imgCount: 6,
    startX: 12,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "up-shoot-walk": {
    image: "champRange",
    imgCount: 6,
    startX: 12,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "up-melee-none": {
    image: "champMelee",
    imgCount: 5,
    startX: 10,
    cycleTime: playerConst.shankTime / 5,
  },
  "up-melee-walk": {
    image: "champMelee",
    imgCount: 5,
    startX: 10,
    cycleTime: playerConst.shankTime / 5,
  },
};

export const playerSpriteJumping: SpriteInfo<
  "rising" | "falling",
  PlayerImageSource
> = {
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
