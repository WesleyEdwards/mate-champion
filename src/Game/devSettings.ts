import { Coordinates } from "./models";

const prodSettings = {
  showDevStats: false,
  hideOpponents: false,
  sandboxDb: false,
  shortLevelScreen: false,
  redOutline: false,
  noDie: false,
  logClickPos: false,
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
  logClickPos: boolean;
};

export const devSettings: Settings = import.meta.env.DEV
  ? ({
      showDevStats: true,
      hideOpponents: false,
      sandboxDb: true,
      shortLevelScreen: true,
      redOutline: false,
      noDie: true,
      logClickPos: true,
    } as const)
  : prodSettings;
