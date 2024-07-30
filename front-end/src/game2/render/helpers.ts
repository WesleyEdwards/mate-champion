import { Coordinates } from "../../Game/models";
import { ChampState } from "../champ";
import { CurrAndPrev } from "../entityTypes";
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
  position: CurrAndPrev,
  cxt: CanvasRenderingContext2D
) => {
  cxt.imageSmoothingEnabled = false;
  cxt.imageSmoothingQuality = "high";

  // window.debounceLog(position);

  cxt.translate(position.curr[0], position.curr[1]);
};
