import { GameState1 } from "../State1";
import { Camera } from "../camera";
import { renderFloor } from "../floor";
import { HasPos } from "../state/helpers";
import { renderBg } from "./background";
import { renderCamera } from "./camera";
import { renderPlayer } from "./champ";
import { RenderFunH } from "./helpers";

export const renderGs = (
  gs: GameState1,
  cxt: CanvasRenderingContext2D,
  pause: boolean
) => {
  if (pause) return;
  renderBg(cxt, gs.camera);

  renderItemWithPosition(gs.camera, renderCamera, cxt, gs.camera);
  renderItemWithPosition(gs.player, renderPlayer, cxt, gs.camera);

  for (const f of gs.floors) {
    renderItemWithPosition(f, renderFloor, cxt, gs.camera);
  }
};

/**
 * - Renders an object, accounting for both camera offset and position of the object
 * - At some point we should probably only account for camera offset once per render
 */
const renderItemWithPosition = <T extends HasPos>(
  obj: T,
  renderFun: RenderFunH<T>,
  cxt: CanvasRenderingContext2D,
  camOffset: Camera
) => {
  cxt.save();

  cxt.translate(-camOffset.position.x, camOffset.position.y);

  if ("x" in obj.position) {
    cxt.translate(obj.position.x, obj.position.y);
  } else {
    cxt.translate(obj.position.curr.x, obj.position.curr.y);
  }

  renderFun(obj)(cxt);

  cxt.restore();

  return;
};
