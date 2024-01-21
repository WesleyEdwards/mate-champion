import { Grog, GrogProps } from "../../Opponent/Grog";
import { Coordinates } from "../../models";
import { LevelInfo } from "../levelInfo";

export const sandboxOpps: (props: {
  direction: "vertical" | "horizontal";
  start: Coordinates;
}) => GrogProps[] = ({ direction, start }) => {
  return Array.from({ length: 50 }).map((_, i) => ({
    initPos: {
      x: start.x + i * (direction === "horizontal" ? 5 : 0),
      y: start.y + i * (direction === "vertical" ? 5 : 0),
    },
    moveSpeed: 0,
  }));
};