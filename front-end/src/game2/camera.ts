import { Coordinates } from "../Game/models";
import { Timer } from "./state/timeHelpers";

export type Camera = {
  // offset
  position: Coordinates;
  velocity: Coordinates;
  time: {
    idleTime: Timer<"up">;
  };
};
