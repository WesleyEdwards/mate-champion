import { Coordinates } from "../Game/models";

export type Camera = {
  // offset
  position: Coordinates;
  velocity: Coordinates;
  time: {
    idleTime: number;
  };
};
