import { bulletConst } from "../Game/constants";
import { createId, generateRandomInt } from "../Game/helpers/utils";
import { Coordinates } from "../Game/models";
import { Textures } from "../gameAssets/textures";
import { Coors, CurrAndPrev, Entity } from "./entityTypes";
import { Groog1 } from "./groog";
import { distBetween } from "./state/helpers";
import { TimerUp, updatePosAndVel } from "./state/timeHelpers";

export type MBulletState = {
  timers: { timeAlive: TimerUp };
  position: CurrAndPrev;
  velocity: CurrAndPrev;
  dead: boolean;
  initPos: Coors;
  dimensions: Coors;
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

export class Bullet1 implements Entity {
  id = createId();
  typeId = "bullet" as const;
  state: MBulletState;

  constructor(s: MBulletState) {
    this.state = s;
  }

  step: Entity["step"] = (deltaT) => {
    updatePosAndVel(this.state.position, this.state.velocity.curr, deltaT);
    if (
      distBetween(this.state.initPos, this.state.position.curr) >
      mBulletConst.distUntilDud
    ) {
      this.state.dead = true;
    }
  };

  render: Entity["render"] = (cxt) => {
    cxt.rotate(
      (() => {
        if (this.state.velocity.curr[0] > 0) return 0;
        if (this.state.velocity.curr[0] < 0) return Math.PI;
        return (Math.PI / 2) * 3;
      })()
    );

    const spritesInRow = 4;
    const whichSprite =
      Math.round(this.state.timers.timeAlive.val / 10) % spritesInRow;

    const imgWidth = 28;

    const w = mBulletConst.widthHeight.x;
    const h = mBulletConst.widthHeight.y;

    cxt.drawImage(
      Textures().bullet,
      imgWidth * whichSprite,
      0,
      imgWidth,
      Textures().bullet.height,
      -w / 2,
      -h / 2,
      w,
      h
    );
  };

  handleInteraction: Entity["handleInteraction"] = (entities) => {
    for (const e of entities) {
      if (e instanceof Groog1) {
        if (
          distBetween(e.state.position.curr, this.state.position.curr) <
          mBulletConst.distFromOppHit
        ) {
          e.state.queueActions.push({ name: "die" });
          this.state.dead = true;
        }
      }
    }
  };
}
