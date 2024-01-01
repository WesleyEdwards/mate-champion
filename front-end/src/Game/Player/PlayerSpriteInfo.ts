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

export type ImageSource =
  | "champIdle"
  | "champMelee"
  | "champWalk"
  | "champUpLookWalk"
  | "champJump"
  | "champRange";

const imageSources: Record<ImageSource, string> = {
  champIdle: champIdle,
  champMelee: champMelee,
  champWalk: champWalk,
  champJump: champJump,
  champRange: champRange,
  champUpLookWalk: champUpLookWalk,
};

export const playerSpriteImages: Record<ImageSource, HTMLImageElement> =
  Object.entries(imageSources).reduce((acc, [k, v]) => {
    const i = new Image();
    i.src = v;
    acc[k] = i;
    return acc;
  }, {} as Record<string, HTMLImageElement>);

export type SpriteDisplay = `${Exclude<
  PlayerDirectionY,
  "down"
>}-${PlayerAction}-${Exclude<PlayerMove, "jump">}`;

export type ImageInfo = {
  image: ImageSource;
  imgCount: number;
  startX: number;
  cycleTime: number;
};

export const playerSpritesInfo: Record<SpriteDisplay, ImageInfo | undefined> = {
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
  "none-shoot-none": {
    image: "champRange",
    imgCount: 6,
    startX: 0,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "none-shoot-walk": {
    // TODO
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
    // TODO
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
    cycleTime: 100,
  },
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

export const playerSpriteJumping: Record<"rising" | "falling", ImageInfo> = {
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