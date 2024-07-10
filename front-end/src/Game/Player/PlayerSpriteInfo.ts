import { playerConst } from "../constants";
import {
  PlayerDirectionY,
  PlayerAction,
  PlayerMove,
} from "./PlayerVectorManager";
import { Textures } from "../../gameAssets/textures";

export type PlayerDescription = `${Exclude<
  PlayerDirectionY,
  "down"
>}-${PlayerAction}-${Exclude<PlayerMove, "jump">}`;

export type ImageInfo = {
  image: () => HTMLImageElement;
  imgCount: number;
  startX: number;
  cycleTime: number;
};

const walkCycleTime = 70;

export type SpriteInfo<DESCRIPTION extends string> = Record<
  DESCRIPTION,
  ImageInfo | undefined
>;

export const playerSpritesInfo: SpriteInfo<PlayerDescription> = {
  "none-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 4,
    startX: 0,
    cycleTime: 1000,
  },
  "none-none-walk": {
    image: () => Textures().champ.walk,
    imgCount: 8,
    startX: 0,
    cycleTime: walkCycleTime,
  },
  "none-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "none-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 0,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "none-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: playerConst.shankTime / 5,
  },
  "none-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 0,
    cycleTime: playerConst.shankTime / 5,
  },

  "up-none-none": {
    image: () => Textures().champ.idle,
    imgCount: 1,
    startX: 8,
    cycleTime: 1000,
  },
  "up-none-walk": {
    image: () => Textures().champ.upLookWalk,
    imgCount: 8,
    startX: 0,
    cycleTime: walkCycleTime,
  },
  "up-shoot-none": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "up-shoot-walk": {
    image: () => Textures().champ.rangedAttack,
    imgCount: 6,
    startX: 12,
    cycleTime: playerConst.shootCoolDown / 6,
  },
  "up-melee-none": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: playerConst.shankTime / 5,
  },
  "up-melee-walk": {
    image: () => Textures().champ.meleeAttack,
    imgCount: 5,
    startX: 10,
    cycleTime: playerConst.shankTime / 5,
  },
};

export const playerSpriteJumping: SpriteInfo<"rising" | "falling"> = {
  rising: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 0,
    cycleTime: 100,
  },
  falling: {
    image: () => Textures().champ.jump,
    imgCount: 1,
    startX: 1,
    cycleTime: 100,
  },
};
