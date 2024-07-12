import { GRAVITY } from "../../Game/constants";
import {
  Groog,
  GroogActionStr,
  groogConst,
  PossibleActionToGroog,
} from "../groog";
import { updatePosAndVel, updateTimers } from "./timeHelpers";

export const updateGroog = (groog: Groog, deltaT: number) => {

  groog.velocity.y += GRAVITY * deltaT;

  processGroogActions(groog);
};

const processActionMap: {
  [K in GroogActionStr]: (g: Groog, act: PossibleActionToGroog<K>) => void;
} = {
  die: (g, _) => {
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
