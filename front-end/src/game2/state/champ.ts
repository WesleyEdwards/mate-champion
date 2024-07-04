import { Champ, ChampAction, champConst } from "../champ";
import { getChampSpritesInfo } from "../render/champ";
import { updatePosAndVel, updateTimers } from "./helpers";

export const updatePlayer = (p: Champ, deltaT: number) => {
  updatePosAndVel(p.position, p.velocity, deltaT);
  updateTimers(p.timer, deltaT);
  if (p.render.curr !== p.render.prev) {
    p.timer.spriteTimer = 0;
  }

  // Update render info
  const currRender = getChampSpritesInfo(p);
  if (currRender !== p.render.prev) {
    p.render.curr = currRender;
    p.render.prev = p.render.curr;
    p.timer.spriteTimer = 0;
  }

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

  cleanActions(p);

  for (const a of p.queueActions) {
    processActionRaw(p, a);
  }

  const isMovingX =
    p.queueActions.includes("MoveLeft") || p.queueActions.includes("MoveRight");

  if (!isMovingX) {
    processActionRaw(p, "StopX");
  }

  p.queueActions = [];
  return;
};

const cleanActions = (p: Champ) => {
  if (p.queueActions.includes("Jump")) {
    const allowedToJump = p.velocity.curr.y === 0 || p.jump.jumps === 0;
    if (allowedToJump) {
      p.queueActions = p.queueActions.filter((a) => !isSetYAct(a));
    } else {
      p.queueActions = p.queueActions.filter((a) => a !== "Jump");
    }
  }
};

const processActionRaw = (champ: Champ, action: ChampAction) => {
  const acts: Record<StringAction, (p: Champ) => void> = {
    MoveRight: (p) => {
      p.velocity.curr.x = champConst.moveSpeed;
      p.facing.x = "right";
    },
    MoveLeft: (p) => {
      p.velocity.curr.x = -champConst.moveSpeed;
      p.facing.x = "left";
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
  };

  if (isSetYAct(action)) {
    champ.position.curr.y = action.setY;
    champ.velocity.curr.y = 0;
    champ.timer.coyoteTime = 0;
  } else {
    acts[action](champ);
  }
};

type StringAction = Exclude<ChampAction, { setY: number }>;

export const isSetYAct = (a: ChampAction): a is { setY: number } => {
  return typeof a !== "string";
};
