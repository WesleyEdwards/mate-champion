import { MBullet, mBulletConst } from "../bullet";
import { Champ } from "../champ";
import { Groog } from "../groog";
import { GameState1 } from "../State1";
import { distBetween } from "./helpers";
import { emptyTime, updatePosAndVel, updateTimers } from "./timeHelpers";

export const updateBullet = (b: MBullet, deltaT: number) => {
  updatePosAndVel(b.position, b.velocity, deltaT);
  updateTimers(b.timer, deltaT);

  if (distBetween(b.initPos, b.position.curr) > mBulletConst.distUntilDud) {
    b.publishQueue.push("die");
  }
};

export const processBullets = (gs: GameState1) => {
  const {player: c, bullets} = gs
  const shoot = c.publishQueue.filter((x) => x.name === "shoot");
  for (const shot of shoot) {
    bullets.push({
      initPos: shot.initPos,
      velocity: { ...shot.velocity },
      position: { prev: { ...shot.initPos }, curr: { ...shot.initPos } },
      publishQueue: [],
      timer: {
        timeAlive: emptyTime("up"),
      },
    });
  }
  c.publishQueue = c.publishQueue.filter((p) => p.name !== "shoot");

  if (gs.bullets.some((b) => b.publishQueue.includes("die"))) {
    const init = gs.bullets.length;
    gs.bullets = gs.bullets.filter((b) => !b.publishQueue.includes("die"));
    if (init !== gs.bullets.length) {
      console.log("dead");
    }
  }
};
