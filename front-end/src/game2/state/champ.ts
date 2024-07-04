import { CharAction } from "../../Game/models";
import { Champ, champConst } from "../champ";
import { updatePosAndVel, updateTimers } from "./helpers";

export const updatePlayer = (p: Champ, deltaT: number) => {
  updatePosAndVel(p.position, p.velocity, deltaT);
  updateTimers(p.timer, deltaT);

  for (const a of p.queueActions) {
    processQueuedAction(p, a);
  }

  const isMovingX =
    p.queueActions.includes("MoveLeft") || p.queueActions.includes("MoveRight");

  if (!isMovingX) {
    processActionRaw(p, "StopX");
  }

  p.queueActions = [];

  // update with gravity
  if (p.gravityFactor) {
    p.gravityFactor *= champConst.jumpGravityFrameDecrease;
  }
  if (p.velocity.curr.y > 0 || !p.jump.isJumping) {
    p.gravityFactor = null;
  }
  if (p.timer.coyoteTime > champConst.maxCoyoteTime || p.velocity.curr.y < 0) {
    const jumpFactor = p.gravityFactor
      ? (1 - p.gravityFactor) * champConst.gravity
      : champConst.gravity;

    p.velocity.curr.y = p.velocity.curr.y + jumpFactor * deltaT;
  }

  return;
};

const processQueuedAction = (p: Champ, action: CharAction) => {
  if (action === "Jump") {
    if (p.velocity.curr.y !== 0 || p.jump.jumps > 0) {
      return;
    }
  }
  processActionRaw(p, action);
};

const processActionRaw = (champ: Champ, action: CharAction) => {
  const acts: Record<CharAction, (p: Champ) => void> = {
    MoveRight: (p) => {
      p.velocity.curr.x = -champConst.moveSpeed;
    },
    MoveLeft: (p) => {
      p.velocity.curr.x = -champConst.moveSpeed;
    },
    Jump: (p) => {
      p.velocity.curr.y = champConst.jumpSpeed;
      p.position.curr.y -= 1;
      p.gravityFactor = champConst.jumpGravityFactor;
      p.jump.jumps += 1;
    },
    Duck: (p) => {},
    StopX: (p) => {
      p.velocity.curr.x = 0;
    },
    StopY: (p) => {
      p.velocity.curr.y = 0;
    },
  };

  acts[action](champ);
};
