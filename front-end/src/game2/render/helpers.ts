import { Coordinates } from "../../Game/models";
import { ChampState } from "../champ";
import { Coors, CurrAndPrev } from "../entityTypes";
import { GroogState } from "../groog";

export type RenderFun<T> = (obj: T) => (cxt: CanvasRenderingContext2D) => void;

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
