import { GRAVITY } from "../loopShared/constants";
import { GroogState, GroogAction, groogConst } from "../entities/groog";
import { ActionMap, UpdateFun } from "./helpers";

const processActionMap: ActionMap<GroogAction, GroogState> = {
  die: (g, _) => {
    if (g.render.curr === "die") return;
    g.render.curr = "die";
    g.timers.dyingTimer.val = groogConst.dieTimer;
    g.timers.sprite.val = 0;
  },
  jump: (g, _) => {
    g.velocity[1] = groogConst.jumpSpeed;
  },
  setX: (g, act) => {
    g.facing = act.dir;
  },
  setY: (g, act) => {
    g.position.curr[1] = act.y;
    g.velocity[1] = 0;
  },
};

export const processGroogActionRaw = (g: GroogState, act: GroogAction) => {
  processActionMap[act.name](g, act as never);
};

export const processGroogActions = (groog: GroogState) => {
  for (const act of groog.queueActions) {
    processGroogActionRaw(groog, act);
  }

  groog.queueActions = [];
};
