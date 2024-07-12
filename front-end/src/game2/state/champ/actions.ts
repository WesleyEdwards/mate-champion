import _ from "lodash";
import {
  Champ,
  ChampAction,
  ChampActionStr,
  PossibleActionToChamp,
  champConst,
} from "../../champ";
import { mBulletConst } from "../../bullet";

export const handleChampActions = (p: Champ) => {
  cleanActions(p);

  if (!queuedContains(p, "moveX")) {
    processActionRaw(p, { name: "stopX" });
  }

  if (!queuedContains(p, "setFacingY")) {
    processActionRaw(p, { name: "setFacingY", dir: "hor" });
  }

  for (const a of p.acceptQueue) {
    processActionRaw(p, a);
  }

  p.acceptQueue = [];
};

const cleanActions = (p: Champ) => {
  // A list of filters to find actions that are NOT allowed
  const notAllowedFilter = p.acceptQueue.reduce<
    ((act: ChampActionStr) => boolean)[]
  >((acc, curr) => {
    if (curr.name === "jump") {
      const allowedToJump = p.velocity.y === 0 || p.jump.jumps === 0;
      if (allowedToJump) {
        acc.push((a) => a === "setY");
      } else {
        acc.push((a) => a === "jump");
      }
    }
    if (curr.name === "melee" || curr.name === "shoot") {
      if (p.timers.actionCoolDownRemain.val > 0) {
        acc.push((a) => a === "melee" || a === "shoot");
      }
    }

    return acc;
  }, []);

  for (const n of notAllowedFilter) {
    p.acceptQueue = p.acceptQueue.filter((a) => !n(a.name));
  }
};

const processActionRaw = (champ: Champ, action: ChampAction) => {
  processActionMap[action.name](champ, action as never);
};

const processActionMap: {
  [K in ChampActionStr]: (p: Champ, act: PossibleActionToChamp<K>) => void;
} = {
  moveX: (p, act) => {
    if (act.dir === "left") {
      p.velocity.x = -champConst.moveSpeed;
    } else {
      p.velocity.x = champConst.moveSpeed;
    }
    p.facing.x = act.dir;
  },
  stopX: (p, _) => {
    p.velocity.x = 0;
  },
  jump: (p, _) => {
    p.velocity.y = champConst.jumpSpeed;
    p.position.curr.y -= 1;
    p.gravityFactor = champConst.jumpGravityFactor;
    p.jump.isJumping = true;
    p.jump.jumps += 1;
  },
  melee: (p, _) => {
    console.log("Melee");
    p.action = "melee";
    p.timers.actionTimeRemain.val = champConst.melee.time;
    p.timers.actionCoolDownRemain.val = champConst.melee.coolDown * 2;
  },
  shoot: (p, _) => {
    console.log("Shooting");
    p.timers.actionTimeRemain.val = champConst.shootCoolDown;
    p.timers.actionCoolDownRemain.val = champConst.shootCoolDown * 2;
    const x = (() => {
      if (p.facing.y === "up") {
        return p.position.curr.x;
      }
      if (p.facing.x === "right") {
        return p.position.curr.x + champConst.widthHeight.x / 2;
      }
      return p.position.curr.x - champConst.widthHeight.x / 2;
    })();

    const y = (() => {
      if (p.facing.y === "up") {
        return p.position.curr.y - champConst.widthHeight.y / 2;
      }
      return p.position.curr.y;
    })();

    const velocity = (() => {
      if (p.facing.y === "up") {
        return { x: 0, y: -mBulletConst.speed };
      }
      if (p.facing.x === "right") {
        return { x: mBulletConst.speed, y: 0 };
      }
      return { x: -mBulletConst.speed, y: 0 };
    })();

    p.publishQueue.push({
      name: "shoot" as const,
      initPos: { x, y },
      velocity,
    });
  },
  setFacingY: (p, act) => {
    p.facing.y = act.dir;
  },
  setY: (p, act) => {
    p.position.curr.y = act.y;
    p.velocity.y = 0;
    p.timers.coyote.val = 0;
  },
};

const queuedContains = (p: Champ, act: ChampActionStr): boolean => {
  return p.acceptQueue.some((a) => a.name === act);
};
