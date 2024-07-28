import { PlayerAction } from "../Game/Player/PlayerVectorManager";
import { generateRandomInt } from "../Game/helpers/utils";
import { Coordinates } from "../Game/models";
import { Entity } from "./State1";
import { calcPlatEntityCollision } from "./interactions";
import { renderPlayer } from "./render/champ";
import { accountForPosition } from "./render/helpers";
import {
  handleChampActions,
  processChampActionRaw,
} from "./state/champ/actions";
import { updatePlayer } from "./state/champ/champ";
import { updateChampSpriteInfo } from "./state/champ/spriteInfo";
import { Coors, CurrAndPrev } from "./state/helpers";
import {
  emptyTime,
  TimerDown,
  TimerUp,
  updatePosAndVel,
  updateTimers,
} from "./state/timeHelpers";

export type ChampState = {
  position: CurrAndPrev;
  velocity: Coors;
  dimensions: Coors;
  dead: false;
  facing: {
    x: ChampDirectionX;
    y: ChampDirectionY;
  };
  jump: {
    jumps: number;
    isJumping: boolean;
  };
  action: "shoot" | "melee" | null;
  render: {
    prev: ChampAssetDes;
    curr: ChampAssetDes;
  };
  gravityFactor: number | null;
  acceptQueue: ChampAction[];
  publishQueue: ChampPublish[];
  timers: {
    sprite: TimerUp;
    coyote: TimerUp;
    actionTimeRemain: TimerDown; // Time left and cool down are both decreased always
    actionCoolDownRemain: TimerDown; // When < 0, the player can take another action
  };
};

type ChampPublish = {
  name: "shoot";
  initPos: Coors;
  velocity: Coors;
};

export type ChampAssetDes = ChampDescription | "rising" | "falling";

type DirY = "hor" | "up";

export type ChampDescription = `${DirY}-${PlayerAction}-${"walk" | "none"}`;

export const champConst = {
  widthHeight: {
    x: 64,
    y: 64,
  },
  moveSpeed: 0.5,
  jumpSpeed: -0.85,
  melee: {
    time: 250,
    coolDown: 275,
    reach: 120,
  },
  shootCoolDown: 200,
  initPos: { x: 400, y: 400 },
  maxCoyoteTime: 80,
  jumpGravityFactor: 0.9,
  jumpGravityFrameDecrease: 0.93,
  render: {
    walkCycleTime: 70,
    imageWidth: 200,
  },
  gravity: 0.004,
} as const;

export type ChampDirectionY = "up" | "down" | "hor";
export type ChampDirectionX = "left" | "right";

export type ChampAction =
  | { name: "moveX"; dir: "left" | "right" }
  | { name: "stopX" }
  | { name: "jump" }
  | { name: "melee" }
  | { name: "shoot" }
  | { name: "setFacingY"; dir: ChampDirectionY }
  | { name: "setY"; y: number };

export class Champ1 implements Entity {
  id = 42;
  typeId = "player" as const;
  state: ChampState;
  constructor(position: CurrAndPrev) {
    this.state = {
      position,
      dimensions: [champConst.widthHeight.x, champConst.widthHeight.y],
      facing: {
        x: "right",
        y: "hor",
      },

      dead: false,
      gravityFactor: null,
      jump: { jumps: 0, isJumping: false },
      action: null,
      render: {
        prev: "falling",
        curr: "falling",
      },
      acceptQueue: [],
      publishQueue: [],
      velocity: [0, 0],
      timers: {
        sprite: emptyTime("up"),
        coyote: emptyTime("up"),
        actionTimeRemain: emptyTime("down"),
        actionCoolDownRemain: emptyTime("down"),
      },
    };
  }

  step: Entity["step"] = (deltaT) => {
    updateTimers(this.state.timers, deltaT);
    updatePosAndVel(this.state.position, this.state.velocity, deltaT);
    updatePlayer(this.state, deltaT);
  };

  render: Entity["render"] = (cxt) => {
    accountForPosition(this.state.position, cxt);
    renderPlayer(this.state, cxt);
  };

  handleInteraction: Entity["handleInteraction"] = (entities) => {
    // for (const entity of entities) {
    //   if (entity.typeId === "floor" || entity.typeId === "platform") {
    //     const y = calcPlatEntityCollision(this, entity);
    //     if (y !== null) {
    //       processChampActionRaw(this.state, { name: "setY", y });
    //     }
    //   }
    // }
  };
}
