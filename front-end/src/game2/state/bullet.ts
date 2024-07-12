import { remove } from "lodash";
import { MBullet, mBulletConst } from "../bullet";
import { GameState1 } from "../State1";
import { distBetween, innitEntity, UpdateFun } from "./helpers";
import { emptyTime } from "./timeHelpers";

export const updateBullet: UpdateFun<MBullet> = (b) => {
  if (distBetween(b.initPos, b.position.curr) > mBulletConst.distUntilDud) {
    b.publishQueue.push("die");
  }
};

export const processBullets = (gs: GameState1) => {
  const { player, bullets } = gs;

  // shoot bullets
  const shoot = player.publishQueue.filter((x) => x.name === "shoot");
  for (const shot of shoot) {
    bullets.push({
      initPos: shot.initPos,
      publishQueue: [],
      ...innitEntity({
        timers: {
          timeAlive: emptyTime("up"),
        },
        velocity: shot.velocity,
        position: shot.initPos,
      }),
    });
  }
  player.publishQueue = player.publishQueue.filter((p) => p.name !== "shoot");

  // collide with groogs
  for (const bullet of gs.bullets) {
    for (const groog of gs.grogs) {
      if (
        distBetween(bullet.position.curr, groog.position.curr) <
        mBulletConst.distFromOppHit
      ) {
        gs.toRemove.push({ type: "bullet", entity: bullet });
        groog.queueActions.push({ name: "die" });
      }
    }
  }

  // Filter out dead ones
  const toDelete = gs.bullets.filter((b) => b.publishQueue.includes("die"));
  for (const b of toDelete) {
    gs.toRemove.push({ type: "bullet", entity: b });
  }
};
