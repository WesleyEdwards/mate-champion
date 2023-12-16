import { DrawImageInfo, MateImages } from "../Drawing/ImageRepos";
import { SpriteOption } from "../Drawing/drawingUtils";
import { PlayerDirection } from "./models";

export function shankingImage(
  facing: PlayerDirection,
  shanking: boolean
): SpriteOption {
  if (!shanking) {
    if (facing === "rightDown") return "right";
    if (facing === "leftDown") return "left";
    return facing;
  }
  if (facing === "leftUp") return "leftUpAttack";
  if (facing === "rightUp") return "rightUpAttack";
  if (facing === "left" || facing === "leftDown") return "leftAttack";
  if (facing === "right" || facing === "rightDown") return "rightAttack";
  throw new Error("Not implemented");
}
