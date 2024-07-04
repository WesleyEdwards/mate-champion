import { PlayerState } from "../champ";
import { RenderFunH } from "./helpers";

export const renderPlayer: RenderFunH<PlayerState> = (p) => (cxt) => {
  cxt.translate(p.position.curr.x, p.position.curr.y);
  cxt.strokeStyle = "red";
  cxt.beginPath();
  cxt.arc(0, 0, 1, 0, 2 * Math.PI);
  cxt.stroke();
  return;
};
