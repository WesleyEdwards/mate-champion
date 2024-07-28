import { remove } from "lodash";
import { Bullet1, MBulletState, mBulletConst } from "../bullet";
import { Entity, GameStateProps } from "../State1";
import { distBetween, emptyCoors, Id, UpdateFun } from "./helpers";
import { emptyTime } from "./timeHelpers";
import { Champ1 } from "../champ";
import { Bullet } from "../../Game/Bullet/Bullet";
import { generateRandomInt, randomOutOf } from "../../Game/helpers/utils";
import { bulletConst } from "../../Game/constants";

export const updateBullet: UpdateFun<MBulletState> = (b) => {
  // if (distBetween(b.initPos, b.position.curr) > mBulletConst.distUntilDud) {
  //   b.publishQueue.push("die");
  // }
};

export const reconcileActions = (player: Champ1, entities: Entity[]) => {
  // const { player, bullets } = gs;
  // shoot bullets
  const shoot = player.state.publishQueue.filter((x) => x.name === "shoot");
  for (const shot of shoot) {
    entities.push(
      new Bullet1({
        timers: {
          timeAlive: {
            count: "up",
            val: 0,
          },
        },
        position: { curr: { ...shot.initPos }, prev: { ...shot.initPos } },
        velocity: { curr: shot.velocity, prev: shot.velocity },
        dead: false,
        initPos: { ...shot.initPos },
        dimensions: [bulletConst.width, bulletConst.height],
      })
    );
  }
  player.state.publishQueue = player.state.publishQueue.filter(
    (p) => p.name !== "shoot"
  );
  // collide with groogs
  // for (const bullet of bullets) {
  //   for (const groog of grogs) {
  //     if (
  //       distBetween(bullet.state.position.curr, groog.position.curr) <
  //       mBulletConst.distFromOppHit
  //     ) {
  //       gs.toRemove.push({ type: "bullet", entity: bullet });
  //       groog.queueActions.push({ name: "die" });
  //     }
  //   }
  // }
  // Filter out dead ones
};
