import { Coordinates } from "../Game/models";
import { Coors } from "./state/helpers";
import { TimerUp } from "./state/timeHelpers";

export type Camera = {
  // offset
  position: Coors;
  velocity: Coors;
  time: {
    idleTime: TimerUp;
  };
};
