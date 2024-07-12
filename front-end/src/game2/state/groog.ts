import { GRAVITY } from "../../Game/constants";
import { Groog, GroogAction, groogConst } from "../groog";
import { ActionMap, UpdateFun } from "./helpers";

export const updateGroog: UpdateFun<Groog> = (groog, deltaT, remove) => {
  if (groog.render.curr === "die" && groog.timers.actionTimeRemain.val <= 0) {
    remove({ type: "groog", entity: groog });
  }

  groog.velocity.y += GRAVITY * deltaT;

  processGroogActions(groog);
};

const processActionMap: ActionMap<GroogAction, Groog> = {
  die: (g, _) => {
    if (g.render.curr === "die") return;
    g.render.curr = "die";
    g.timers.actionTimeRemain.val = groogConst.dieTimer;
    g.timers.sprite.val = 0;
  },
  jump: (g, _) => {
    g.velocity.y = groogConst.jumpSpeed;
  },
  setX: (g, act) => {
    g.facing = act.dir;
  },
  setY: (g, act) => {
    g.position.curr.y = act.y;
    g.velocity.y = 0;
  },
};

const processGroogActions = (groog: Groog) => {
  for (const act of groog.queueActions) {
    processActionMap[act.name](groog, act as never);
  }

  groog.queueActions = [];
};
