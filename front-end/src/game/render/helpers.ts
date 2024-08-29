import { Coors } from "../entities/entityTypes";

export type SpriteAssetInfo<DESCRIPTION extends string> = Record<
  DESCRIPTION,
  AssetInfo | undefined
>;

export type AssetInfo = {
  image: () => HTMLImageElement;
  imgCount: number;
  startX: number;
  cycleTime: () => number;
};

export const accountForPosition = (
  position: Coors,
  cxt: CanvasRenderingContext2D
) => {
  cxt.imageSmoothingEnabled = false;
  cxt.imageSmoothingQuality = "high";

  cxt.translate(position[0], position[1]);
};
