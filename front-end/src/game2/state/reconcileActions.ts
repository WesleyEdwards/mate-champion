import { remove } from "lodash";
import { Bullet1, MBulletState, mBulletConst } from "../bullet";
import { Entity, GameStateProps } from "../State1";
import { Champ1 } from "../champ";
import { bulletConst } from "../../Game/constants";
import { Camera } from "../camera";
import { Keys } from "../../Game/models";
import { updateKeys } from "./keys";
import { updateCameraWithPlayer } from "./camera";

export const reconcileActions = (gs: GameStateProps) => {
  for (const entity of gs.entities) {
    if (entity instanceof Champ1) {
      const shoot = entity.state.publishQueue.filter((x) => x.name === "shoot");
      for (const shot of shoot) {
        gs.entities.push(
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
      entity.state.publishQueue = entity.state.publishQueue.filter(
        (p) => p.name !== "shoot"
      );

      updateCameraWithPlayer(gs.camera, entity.state);
      updateKeys(gs.keys, entity.state);
    }
  }
};
