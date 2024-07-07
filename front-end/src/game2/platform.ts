import { Coordinates } from "../Game/models";
import { Champ, champConst } from "./champ";
import { calcPlatPlayerCollision } from "./floor";
import { RenderFunH } from "./render/helpers";

export type PlatformState = {
  color: string;
  position: Coordinates;
  widthHeight: Coordinates;
};

export const renderPlatform: RenderFunH<PlatformState> = (f) => (cxt) => {
  cxt.fillStyle = f.color;
  cxt.strokeStyle = "black";
  cxt.lineWidth = 8;

  cxt.strokeRect(0, 0, f.widthHeight.x, f.widthHeight.y);
  cxt.fillRect(0, 0, f.widthHeight.x, f.widthHeight.y);
};

export const updatePlatforms = (platforms: PlatformState[], champ: Champ) => {
    if (champ.facing.y === "down") {
      return;
    }
  for (const platform of platforms) {
    calcPlatPlayerCollision(platform, champ);
  }
};
