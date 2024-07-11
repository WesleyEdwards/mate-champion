import { Coordinates } from "../Game/models";
import { TimerUp } from "./state/timeHelpers";

export type Camera = {
  // offset
  position: Coordinates;
  velocity: Coordinates;
  time: {
    idleTime: TimerUp;
  };
};
