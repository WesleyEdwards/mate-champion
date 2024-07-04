import { GameState1 } from "../State1";
import { renderBg } from "./background";
import { renderPlayer } from "./champ";
import { RenderFun } from "./helpers";

export const renderGs: RenderFun<GameState1> = (gs, cxt) => {
    const rp = renderPlayer(gs.player);
  
    renderBg(cxt, gs.cameraOffset);
    renderItem(rp, cxt);
  };
  

const renderItem = (
    r: (cxt: CanvasRenderingContext2D) => void,
    cxt: CanvasRenderingContext2D
  ) => {
    cxt.save();
    // cxt.translate(point.x - camOffset.x, point.y + camOffset.y);
    r(cxt);
    cxt.restore();
  };