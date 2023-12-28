import { Coordinates } from "./models";

const prodSettings: Record<keyof Settings, false> = {
  showDevStats: false,
  hideOpponents: false,
  sandboxDb: false,
  shortLevelScreen: false,
  redOutline: false,
  cameraLines: false,
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
  cameraLines: boolean;
  noDie: boolean;
  oneLife: boolean;
  courseBuilder: boolean;
};

export const devSettings: Settings = import.meta.env.DEV
  ? ({
      showDevStats: false,
      hideOpponents: false,
      sandboxDb: false,
      shortLevelScreen: true,
      redOutline: true,
      cameraLines: false,
      noDie: true,
      oneLife: true,
      courseBuilder: true,
    } as const)
  : prodSettings;
