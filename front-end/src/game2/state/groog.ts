import { GRAVITY } from "../../Game/constants";
import { GroogState, GroogAction, groogConst } from "../groog";
import { ActionMap, UpdateFun } from "./helpers";

export const updateGroog: UpdateFun<GroogState> = (groog, deltaT) => {
  if (groog.render.curr === "die" && groog.timers.actionTimeRemain.val <= 0) {
    groog.dead = true;
  }

  groog.velocity[1] += GRAVITY * deltaT;

  processGroogActions(groog);
};

const processActionMap: ActionMap<GroogAction, GroogState> = {
  die: (g, _) => {
    if (g.render.curr === "die") return;
    g.render.curr = "die";
    g.timers.actionTimeRemain.val = groogConst.dieTimer;
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

const processGroogActions = (groog: GroogState) => {
  for (const act of groog.queueActions) {
    processActionMap[act.name](groog, act as never);
  }

  groog.queueActions = [];
};
