import { Bullet1, mBulletConst } from "../bullet";
import { Champ1 } from "../champ";
import { updateKeys } from "./keys";
import { updateCameraWithPlayer } from "./camera";
import { Coors, GameStateProps } from "../entityTypes";
import { toCurrAndPrev } from "../helpers";
import { emptyTime } from "./timeHelpers";

export const reconcileActions = (gs: GameStateProps) => {
  for (const entity of gs.entities) {
    if (entity instanceof Champ1) {
      const shoot = entity.state.publishQueue.filter((x) => x.name === "shoot");
      for (const shot of shoot) {
        if (gs.stats.ammo.curr > 0) {
          gs.stats.ammo.curr -= 1;

          const isVert = Math.abs(shot.velocity[1]) > 0;

          const actualPos: Coors = isVert
            ? [
                shot.initPos[0] - mBulletConst.dimensions[1] / 2,
                shot.initPos[1],
              ]
            : [
                shot.initPos[0],
                shot.initPos[1] - mBulletConst.dimensions[1] / 2,
              ];

          gs.entities.push(
            new Bullet1({
              timers: {
                timeAlive: emptyTime("up"),
              },
              position: toCurrAndPrev(actualPos),
              velocity: { curr: shot.velocity, prev: shot.velocity },
              dead: false,
              initPos: { ...actualPos },
              dimensions: [
                mBulletConst.dimensions[0],
                mBulletConst.dimensions[1],
              ],
              drawDimensions: [
                mBulletConst.drawDimensions[0],
                mBulletConst.drawDimensions[1],
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
