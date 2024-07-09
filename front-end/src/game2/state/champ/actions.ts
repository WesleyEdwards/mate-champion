import _ from "lodash";
import {
  Champ,
  ChampAction,
  ChampActionStr,
  PossibleActionToChamp,
  champConst,
} from "../../champ";

export const handleChampActions = (p: Champ) => {
  cleanActions(p);

  if (!queuedContains(p, "moveX")) {
    processActionRaw(p, { name: "stopX" });
  }

  if (!queuedContains(p, "setFacingY")) {
    processActionRaw(p, { name: "setFacingY", dir: "hor" });
  }

  for (const a of p.queueActions) {
    processActionRaw(p, a);
  }

  p.queueActions = [];
};

const cleanActions = (p: Champ) => {
  // A list of filters to find actions that are NOT allowed
  const notAllowedFilter = p.queueActions.reduce<
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
    if (curr.name === "melee") {
      if (p.timer.actionCoolDownRemain.val > 0) {
        acc.push((a) => a === "melee");
      }
    }
    return acc;
  }, []);

  for (const n of notAllowedFilter) {
    p.queueActions = p.queueActions.filter((a) => !n(a.name));
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
    p.jump.jumps += 1;
  },
  melee: (p, _) => {
    p.action = "melee";
    p.timer.actionTimeRemain.val = champConst.melee.time;
    p.timer.actionCoolDownRemain.val =
      champConst.melee.coolDown + champConst.melee.time;
  },
  setFacingY: (p, act) => {
    p.facing.y = act.dir;
  },
  setY: (p, act) => {
    p.position.curr.y = act.y;
    p.velocity.y = 0;
    p.timer.coyote.val = 0;
  },
};

const queuedContains = (p: Champ, act: ChampActionStr): boolean => {
  return p.queueActions.some((a) => a.name === act);
};
