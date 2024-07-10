import { Coordinates } from "../Game/models";
import { Textures } from "../gameAssets/textures";
import { RenderFunH } from "./render/helpers";
import { CurrAndPrev, distBetween } from "./state/helpers";
import { Timer, updatePosAndVel, updateTimers } from "./state/timeHelpers";

export type MBullet = {
  position: CurrAndPrev;
  velocity: Coordinates;
  initPos: Coordinates;
  timer: {
    timeAlive: Timer<"up">;
  };
  publishQueue: "die"[];
};


export const mBulletConst = {
  widthHeight: {
    x: 42,
    y: 24,
  },
  speed: 0.9,
  distUntilDud: 800,
  distFromOppHit: 40,
} as const;
