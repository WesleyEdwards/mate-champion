import { remove } from "lodash";
import { Bullet1, MBulletState, mBulletConst } from "../bullet";
import { Entity, GameStateProps } from "../State1";
import { Champ1 } from "../champ";
import { bulletConst } from "../../Game/constants";

export const reconcileActions = (player: Champ1, entities: Entity[]) => {
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
};
