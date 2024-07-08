import { GameState1 } from "../State1";
import { Camera } from "../camera";
import { renderFloor } from "../floor";
import { renderPlatform } from "../platform";
import { HasPos } from "../state/helpers";
import { renderBg } from "./background";
import { renderPlayer } from "./champ";
import { renderGroog } from "./groog";
import { RenderFunH, renderItemWithPosition } from "./helpers";

export const renderGs = (
  gs: GameState1,
  cxt: CanvasRenderingContext2D,
  pause: boolean
) => {
  if (pause) return;

  // Account for cam offset
  cxt.save();
  cxt.translate(-gs.camera.position.x, gs.camera.position.y);

  renderItemWithPosition(gs.camera, renderBg, cxt);
  renderItemWithPosition(gs.player, renderPlayer, cxt);

  for (const groog of gs.grogs) {
    renderItemWithPosition(groog, renderGroog, cxt);
  }

  for (const f of gs.floors) {
    renderItemWithPosition(f, renderFloor, cxt);
  }

  for (const p of gs.platforms) {
    renderItemWithPosition(p, renderPlatform, cxt);
  }

  // restore from cam offset
  cxt.restore();
};
