import { MBullet, mBulletConst } from "../bullet";
import { Groog } from "../groog";
import { distBetween } from "./helpers";
import { updatePosAndVel, updateTimers } from "./timeHelpers";

export const updateBullet = (b: MBullet, deltaT: number) => {
  updatePosAndVel(b.position, b.velocity, deltaT);
  updateTimers(b.timer, deltaT);

  if (distBetween(b.initPos, b.position.curr) > mBulletConst.distUntilDud) {
    b.publishQueue.push("die");
  }
};

export const processBullets = (bullets: MBullet[], groogs: Groog[]) => {
  if (bullets.some((b) => b.publishQueue.includes("die"))) {
    bullets = bullets.filter((b) => !b.publishQueue.includes("die"));
    console.log("New b:", [...bullets]);
  }
};
