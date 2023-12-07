type Settings = {
  showFPS: boolean;
  opponents: boolean;
  sandboxDb: boolean;
  shortLevelScreen: boolean;
  redOutline: boolean;
};

const prodSettings = {
  showFPS: false,
  opponents: false,
  sandboxDb: false,
  shortLevelScreen: false,
  redOutline: false,
} as const;

export const devSettings: Settings = import.meta.env.DEV
  ? ({
      showFPS: true,
      opponents: true,
      sandboxDb: true,
      shortLevelScreen: true,
      redOutline: false,
    } as const)
  : prodSettings;
