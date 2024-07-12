import { Coordinates } from "../Game/models";
import { Entity } from "./state/helpers";
import { TimerUp } from "./state/timeHelpers";

export type MBullet = {
  initPos: Coordinates;
  publishQueue: "die"[];
} & Entity<{ timeAlive: TimerUp }>;

export const mBulletConst = {
  widthHeight: {
    x: 42,
    y: 24,
  },
  speed: 0.9,
  distUntilDud: 800,
  distFromOppHit: 40,
} as const;
