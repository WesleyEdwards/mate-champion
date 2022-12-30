import { oppConstants, playerConstants } from "../constants";
import { makeImage, MCImage } from "./drawingUtils";

export const potImage = makeImage(500, 750, "mate-pot");

export interface OppImages {
  left: MCImage;
  right: MCImage;
}

const oppWidth = oppConstants.radius * 2;

export const oppImages: OppImages = {
  left: makeImage(oppWidth, oppWidth, "opponent-left"),
  right: makeImage(oppWidth, oppWidth, "opponent-right"),
};

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

const playerWidth = playerConstants.radius * 2;

export const mateImages: MateImages = {
  left: makeImage(playerWidth, playerWidth, "mate-left"),
  right: makeImage(playerWidth, playerWidth, "mate-right"),
  leftUp: makeImage(playerWidth, playerWidth, "mate-left-up"),
  rightUp: makeImage(playerWidth, playerWidth, "mate-right-up"),
  rightDown: makeImage(playerWidth, playerWidth, "mate-right"),
  leftDown: makeImage(playerWidth, playerWidth, "mate-left"),
  shanking: {
    left: makeImage(playerWidth * 1.5, playerWidth, "shank-left"),
    leftDown: makeImage(playerWidth * 1.5, playerWidth, "shank-left"),
    right: makeImage(playerWidth * 1.5, playerWidth, "shank-right"),
    rightDown: makeImage(playerWidth * 1.5, playerWidth * 1.5, "shank-right"),
    leftUp: makeImage(playerWidth, playerWidth * 1.5, "shank-left-up"),
    rightUp: makeImage(playerWidth, playerWidth * 1.5, "shank-right-up"),
  },
};

export interface DrawImageInfo {
  image: MCImage;
  xOffset?: number;
  yOffset?: number;
}
