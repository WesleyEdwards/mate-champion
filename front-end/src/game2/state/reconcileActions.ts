import { remove } from "lodash";
import { Bullet1, mBulletConst } from "../bullet";
import { Champ1 } from "../champ";
import { Keys } from "../../Game/models";
import { updateKeys } from "./keys";
import { updateCameraWithPlayer } from "./camera";
import { GameStateProps } from "../entityTypes";

export const reconcileActions = (gs: GameStateProps) => {
  for (const entity of gs.entities) {
    if (entity instanceof Champ1) {
      const shoot = entity.state.publishQueue.filter((x) => x.name === "shoot");
      for (const shot of shoot) {
        if (gs.stats.ammo.curr > 0) {
          gs.stats.ammo.curr -= 1;
          gs.entities.push(
            new Bullet1({
              timers: {
                timeAlive: {
                  count: "up",
                  val: 0,
                },
              },
              position: {
                curr: { ...shot.initPos },
                prev: { ...shot.initPos },
              },
              velocity: { curr: shot.velocity, prev: shot.velocity },
              dead: false,
              initPos: { ...shot.initPos },
              dimensions: [
                mBulletConst.dimensions[0],
                mBulletConst.dimensions[1],
              ],
            })
          );
        }
      }
      entity.state.publishQueue = entity.state.publishQueue.filter(
        (p) => p.name !== "shoot"
      );

      updateCameraWithPlayer(gs.camera, entity.state);
      updateKeys(gs.keys, entity.state);
    }
  }
};
