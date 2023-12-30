import { debounceLog } from "../helpers/utils";
import { SpriteDisplay } from "./PlayerDrawManager";
import {
  PlayerAction,
  PlayerDirectionX,
  PlayerDirectionY,
  PlayerMove,
} from "./PlayerVectorManager";

// type DirectionX = "left" | "right";
// type DirectionY = "up" | "down" | "none";
// type Action = "shoot" | "melee" | "none";
// type Move = "walk" | "none";

export function getSpriteDisplay(
  facingX: PlayerDirectionX,
  facingY: PlayerDirectionY,
  action: PlayerAction,
  walking: PlayerMove
): SpriteDisplay {
  // if (facingX === "left") return "left-none-none-none";
  // if (facingX === "right") return "right-none-none-none";

  if (action !== "none") {
    // console.log(`${facingX}-${facingY}-${action}-none`);
  }
  // if (facing === "rightUp") return "right-none-none-none";
  // if (facing === "leftUp") return "leftUpLook";

  return `${facingX}-${facingY}-${action}-${walking}`;
  // if (!shanking) {
  //   if (facing === "rightDown") return "right";
  //   if (facing === "leftDown") return "left";
  //   return facing;
  // }
  // if (facing === "leftUp") return "leftUpAttack";
  // if (facing === "rightUp") return "rightUpAttack";
  // if (facing === "left" || facing === "leftDown") return "leftAttack";
  // if (facing === "right" || facing === "rightDown") return "rightAttack";
  // throw new Error("Not implemented");
}
