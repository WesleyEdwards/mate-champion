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

