import { Coordinates } from "../../Game/models";
import { Champ } from "../champ";
import { Groog } from "../groog";
import { CurrAndPrev } from "../state/helpers";
import { GameState1 } from "../State1";

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
const renderItemWithPosition = <
  T extends { position: Coordinates | CurrAndPrev }
>(
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

export const renderItemsOnCanvas = (
  itemsToRender: RenderItem<any>[],
  cxt: CanvasRenderingContext2D,
  gs: GameState1
) => {
  const camPos = gs.camera.position;
  // Account for cam offset
  cxt.save();
  cxt.translate(-camPos.x, camPos.y);

  for (const builder of itemsToRender) {
    for (const item of builder.getter(gs)) {
      renderItemWithPosition(item, builder.fun, cxt);
    }
  }
  // restore from cam offset
  cxt.restore();
};

type RenderItem<T> = {
  fun: RenderFunH<T>;
  getter: (gs: GameState1) => T[];
};

export type RenderableItems = RenderItem<any>[];

export const renderBuilder = <T>(props: RenderItem<T>) => props;

// possible alternative to renderItemBuilder
// type Renderable = { player: Champ; groog: Groog };
// type RenderableItems = {
//   [K in Extract<keyof Renderable, string>]-?: {
//     key: K;
//     fun: RenderFunH<Renderable[K]>;
//     getter: (value: GameState1) => Renderable[K][];
//   };
// }[Extract<keyof Renderable, string>];
