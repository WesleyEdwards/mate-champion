import { opponentConst } from "../constants";
import { makeImage, MCImage } from "./drawingUtils";

export const potImage = makeImage(500, 750, "matePot");

export interface OppImages {
  left: MCImage;
  right: MCImage;
}

const oppWidth = opponentConst.radius * 2;

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

export interface DrawImageInfo {
  image: MCImage;
  xOffset?: number;
  yOffset?: number;
}
