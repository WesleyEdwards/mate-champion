import { oppConstants, PLAYER_CONST } from "../constants";
import { makeImage, MCImage } from "./drawingUtils";

export const potImage = makeImage(500, 750, "matePot");

export interface OppImages {
  left: MCImage;
  right: MCImage;
}

const oppWidth = oppConstants.radius * 2;

export const oppImages: OppImages = {
  left: makeImage(oppWidth, oppWidth, "opponentLeft"),
  right: makeImage(oppWidth, oppWidth, "opponentRight"),
};

export const packageImage: MCImage = makeImage(60, 75, "package");

interface MateShankingImages {
  left: MCImage;
  right: MCImage;
  leftUp: MCImage;
  rightUp: MCImage;
  rightDown: MCImage;
  leftDown: MCImage;
}

export interface MateImages {
  left: MCImage;
  right: MCImage;
  leftUp: MCImage;
  rightUp: MCImage;
  rightDown: MCImage;
  leftDown: MCImage;
  shanking: MateShankingImages;
}

const playerWidth = PLAYER_CONST.radius * 2;

export const mateImages: MateImages = {
  left: makeImage(playerWidth, playerWidth, "mateLeft"),
  right: makeImage(playerWidth, playerWidth, "mateRight"),
  leftUp: makeImage(playerWidth, playerWidth, "mateLeftUp"),
  rightUp: makeImage(playerWidth, playerWidth, "mateRightUp"),
  rightDown: makeImage(playerWidth, playerWidth, "mateRight"),
  leftDown: makeImage(playerWidth, playerWidth, "mateLeft"),
  shanking: {
    left: makeImage(playerWidth * 1.5, playerWidth, "shankLeft"),
    leftDown: makeImage(playerWidth * 1.5, playerWidth, "shankLeft"),
    right: makeImage(playerWidth * 1.5, playerWidth, "shankRight"),
    rightDown: makeImage(playerWidth * 1.5, playerWidth * 1.5, "shankRight"),
    leftUp: makeImage(playerWidth, playerWidth * 1.5, "shankLeftUp"),
    rightUp: makeImage(playerWidth, playerWidth * 1.5, "shankRightUp"),
  },
};

export interface DrawImageInfo {
  image: MCImage;
  xOffset?: number;
  yOffset?: number;
}
