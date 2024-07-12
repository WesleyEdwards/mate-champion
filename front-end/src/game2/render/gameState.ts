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
import { renderBuilder, renderItemsOnCanvas } from "./helpers";
import { boxBulletRender, boxChampRender, boxGroogRender } from "./renderBoxes";

export const renderGs = (
  gs: GameState1,
  cxt: CanvasRenderingContext2D,
  pause: boolean
) => {
  if (pause) return;

  renderItemsOnCanvas(
    [
      renderBuilder({ fun: renderBg, getter: (gs) => [gs.camera] }),
      renderBuilder({ fun: renderPlayer, getter: (gs) => [gs.player] }),
      renderBuilder({ fun: renderBullet, getter: (gs) => gs.bullets }),
      renderBuilder({ fun: renderGroog, getter: (gs) => gs.grogs }),
      renderBuilder({ fun: renderFloor, getter: (gs) => gs.floors }),
      renderBuilder({ fun: renderPlatform, getter: (gs) => gs.platforms }),
    ],
    cxt,
    gs
  );

  if (window.mateSettings.collisionBoxesVisible) {
    renderItemsOnCanvas(
      [
        renderBuilder({ fun: boxBulletRender, getter: (gs) => gs.bullets }),
        renderBuilder({ fun: boxGroogRender, getter: (gs) => gs.grogs }),
        renderBuilder({ fun: boxChampRender, getter: (gs) => [gs.player] }),
      ],
      cxt,
      gs
    );
  }
};
