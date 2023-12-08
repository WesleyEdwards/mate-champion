import { Coordinates } from "./models";

export type DevStats = {
  coor: Coordinates;
  vel: Coordinates;
};

type Settings = {
  showDevStats: boolean;
  opponents: boolean;
  sandboxDb: boolean;
  shortLevelScreen: boolean;
  redOutline: boolean;
  noDie: boolean;
  logClickPos: boolean;
};

const prodSettings = {
  showDevStats: false,
  opponents: false,
  sandboxDb: false,
  shortLevelScreen: false,
  redOutline: false,
  noDie: false,
  logClickPos: false,
} as const;

export const devSettings: Settings = import.meta.env.DEV
  ? ({
      showDevStats: true,
      opponents: true,
      sandboxDb: true,
      shortLevelScreen: true,
      redOutline: false,
      noDie: true,
      logClickPos: true,
    } as const)
  : prodSettings;
