import { localStorageManager } from "../../../api/localStorageManager";
import { Coordinates, FullLevelInfo } from "../models";
import { EditableEntity } from "../../../components/GameEdit/CourseBuilderSettings";

const prodSettings: Record<keyof Settings, false> = {
  showDevStats: false,
  collisionBoxesVisible: false,
  cameraLines: false,
} as const;

export type DevStats = {
  coor: Coordinates;
  vel: Coordinates;
};

export type Settings = {
  showDevStats: boolean;
  collisionBoxesVisible: boolean;
  cameraLines: boolean;
};

export const devSettings = () => {
  return {
    modifyingItem: window.selectedItem,
    mateSettings: window.mateSettings,
  };
};

export const modifyDevSettings = (setting: keyof Settings, value: boolean) => {
  window.mateSettings[setting] = value;
  localStorageManager.set("dev-settings", window.mateSettings);
};

export const setToNoDevSettings = () => {
  window.mateSettings = { ...prodSettings };
  localStorageManager.set("dev-settings", window.mateSettings);
};

export const contentCreatorModifyObject = (item: EditableEntity) => {
  window.selectedItem = item;
};

export const initializeDevSettings = () => {
  const fromStorage = localStorageManager.get("dev-settings");
  if (fromStorage && !("noDie" in fromStorage)) {
    window.mateSettings = fromStorage;
  } else {
    localStorageManager.set("dev-settings", prodSettings);
    window.mateSettings = prodSettings;
  }
  window.selectedItem = "platform";
};
