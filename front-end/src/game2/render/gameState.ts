import { Coordinates } from "../../Game/models";
import { GameState1 } from "../State1";
import { Champ } from "../champ";
import { renderFloor } from "../floor";
import { Groog } from "../groog";
import { renderPlatform } from "../platform";
import { renderBg } from "./background";
import { renderBullet } from "./bullet";
import { renderPlayer } from "./champ";
import { renderGroog } from "./groog";
import { RenderableItems, renderBuilder, renderItemsOnCanvas } from "./helpers";

export const renderGs = (
  gs: GameState1,
  cxt: CanvasRenderingContext2D,
  pause: boolean
) => {
  if (pause) return;

  const builders: RenderableItems = [
    renderBuilder({ fun: renderBg, getter: (gs) => [gs.camera] }),
    renderBuilder({ fun: renderPlayer, getter: (gs) => [gs.player] }),
    renderBuilder({ fun: renderBullet, getter: (gs) => gs.bullets }),
    renderBuilder({ fun: renderGroog, getter: (gs) => gs.grogs }),
    renderBuilder({ fun: renderFloor, getter: (gs) => gs.floors }),
    renderBuilder({ fun: renderPlatform, getter: (gs) => gs.platforms }),
  ];

  renderItemsOnCanvas(builders, cxt, gs);
};
