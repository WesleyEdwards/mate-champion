import { HasPos } from "../state/helpers";

export type RenderFunH<T> = (obj: T) => (cxt: CanvasRenderingContext2D) => void;

export type SpriteAssetInfo<DESCRIPTION extends string> = Record<
  DESCRIPTION,
  AssetInfo | undefined
>;

export type AssetInfo = {
  image: () => HTMLImageElement;
  imgCount: number;
  startX: number;
  cycleTime: number;
};

/**
 * - Renders an object, accounting for the position of the object
 */
export const renderItemWithPosition = <T extends HasPos>(
  obj: T,
  renderFun: RenderFunH<T>,
  cxt: CanvasRenderingContext2D
) => {
  cxt.save();

  cxt.imageSmoothingEnabled = false;
  cxt.imageSmoothingQuality = "high";

  if ("x" in obj.position) {
    cxt.translate(obj.position.x, obj.position.y);
  } else {
    cxt.translate(obj.position.curr.x, obj.position.curr.y);
  }

  renderFun(obj)(cxt);

  cxt.restore();

  return;
};
