import { Champ, ChampAction, champConst } from "../../champ";

export const handleChampActions = (p: Champ) => {
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
};

const cleanActions = (p: Champ) => {
  // A list of filters to find actions that are NOT allowed
  const notAllowedFilter = p.queueActions.reduce<
    ((act: ChampAction) => boolean)[]
  >((acc, curr) => {
    if (curr === "Jump") {
      const allowedToJump = p.velocity.curr.y === 0 || p.jump.jumps === 0;
      if (allowedToJump) {
        acc.push((a) => isSetYAct(a));
      } else {
        acc.push((a) => a === "Jump");
      }
    }
    if (curr === "Melee") {
      if (p.timer.actionCoolDownRemain.val > 0) {
        acc.push((a) => a === "Melee");
      }
    }
    return acc;
  }, []);

  for (const n of notAllowedFilter) {
    p.queueActions = p.queueActions.filter((a) => !n(a));
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
    Melee: (p) => {
      p.action = "melee";
      p.timer.actionTimeRemain.val = champConst.melee.time;
      p.timer.actionCoolDownRemain.val =
        champConst.melee.coolDown + champConst.melee.time;
    },
  };

  if (isSetYAct(action)) {
    champ.position.curr.y = action.setY;
    champ.velocity.curr.y = 0;
    champ.timer.coyote.val = 0;
  } else {
    acts[action](champ);
  }
};

type StringAction = Exclude<ChampAction, { setY: number }>;

export const isSetYAct = (a: ChampAction): a is { setY: number } => {
  return typeof a !== "string";
};
