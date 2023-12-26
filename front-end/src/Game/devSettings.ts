import { Coordinates } from "./models";

const prodSettings = {
  showDevStats: false,
  hideOpponents: false,
  sandboxDb: false,
  shortLevelScreen: false,
  redOutline: false,
  noDie: false,
  oneLife: false,
  courseBuilder: false,
} as const;

export type DevStats = {
  coor: Coordinates;
  vel: Coordinates;
};

type Settings = {
  showDevStats: boolean;
  hideOpponents: boolean;
  sandboxDb: boolean;
  shortLevelScreen: boolean;
  redOutline: boolean;
  noDie: boolean;
  oneLife: boolean;
  courseBuilder: boolean;
};

export const devSettings: Settings = import.meta.env.DEV
  ? ({
      showDevStats: true,
      hideOpponents: false,
      sandboxDb: false,
      shortLevelScreen: true,
      redOutline: true,
      noDie: true,
      oneLife: true,
      courseBuilder: false,
    } as const)
  : prodSettings;
