import { localStorageManager } from "../api/localStorageManager";
import { ItemType } from "./devTools/CreatingThing";
import { Coordinates } from "./models";

const prodSettings: Record<keyof Settings, false> = {
  showDevStats: false,
  hideOpponents: false,
  sandboxDb: false,
  shortLevelScreen: false,
  redOutline: false,
  cameraLines: false,
  noDie: false,
  unlimitedBullets: false,
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
  unlimitedBullets: boolean;
  oneLife: boolean;
  courseBuilder: boolean;
};

class DevSettingsClass {
  settings: Settings;
  modifyingItem: ItemType = "platform";
  constructor() {
    const fromStorage = localStorageManager.get("dev-settings");
    if (!fromStorage) {
      localStorageManager.set("dev-settings", prodSettings);
    }
    this.settings = prodSettings;
    return;
  }

  modifySettings(setting: keyof Settings, value: boolean) {
    this.settings[setting] = value;
    localStorageManager.set("dev-settings", this.settings);
  }
  modifyItem(item: ItemType) {
    this.modifyingItem = item;
  }
}

const DevSettings = (() => {
  let instance: DevSettingsClass;
  return {
    getInstance: function () {
      if (!instance) {
        instance = new DevSettingsClass();
      }
      return instance;
    },
  };
})();

export const devSettings = import.meta.env.DEV
  ? DevSettings.getInstance().settings
  : prodSettings;

export const modifyDevSettings = (setting: keyof Settings, value: boolean) => {
  DevSettings.getInstance().modifySettings(setting, value);
};

export const contentCreatorModifyObject = (item: ItemType) => {
  DevSettings.getInstance().modifyItem(item);
};
