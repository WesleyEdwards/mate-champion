import { Coordinates } from "../Game/models";
import { Timer } from "./champ";

export type Camera = {
  // offset
  position: Coordinates;
  velocity: Coordinates;
  time: {
    idleTime: Timer;
  };
};
