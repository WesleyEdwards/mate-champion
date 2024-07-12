import { GRAVITY } from "../../Game/constants";
import { ActionMap, Groog, GroogAction, groogConst } from "../groog";
import { UpdateFun } from "./helpers";

export const updateGroog: UpdateFun<Groog> = (groog, deltaT, remove) => {
  if (groog.render.curr === "die" && groog.timers.actionTimeRemain.val <= 0) {
    remove({ type: "groog", entity: groog });
  }

  groog.velocity.y += GRAVITY * deltaT;

  processGroogActions(groog);
};

const processActionMap: {
  [K in GroogAction["name"]]: (g: Groog, act: ActionMap[K]) => void;
} = {
  die: (g, _) => {
    g.render.curr = "die";
    g.timers.actionTimeRemain = { count: "down", val: groogConst.dieTimer };
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
