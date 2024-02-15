import { LevelInfo } from "../Game/models";

type KeyName = "token" | "high-score" | "dev-settings";

export const localStorageManager = {
  get: (key: KeyName) => {
    const value = localStorage.getItem(`mate-${key}`);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  set: (key: KeyName, value: any) => {
    localStorage.setItem(`mate-${key}`, JSON.stringify(value));
  },
  remove: (key: string) => {
    localStorage.removeItem(`mate-${key}`);
  },
  saveLevel: (level: LevelInfo) => {
    const levels: string[] = JSON.parse(
      localStorage.getItem("mate-levels") ?? "[]"
    );
    if (!levels.includes(level._id)) {
      levels.push(level._id);
      localStorage.setItem("mate-levels", JSON.stringify(levels));
    }

    localStorage.setItem(level._id, JSON.stringify(level));
  },

  removeLevel: (level: LevelInfo) => {
    const levels: string[] = JSON.parse(
      localStorage.getItem("mate-levels") ?? "[]"
    );
    if (!levels.includes(level._id)) {
      const filtered = levels.filter((l) => l !== level._id);
      localStorage.setItem("mate-levels", JSON.stringify(filtered));
    }

    localStorage.removeItem(level._id);
  },

  getLevels: (): LevelInfo[] => {
    const levels: string[] = JSON.parse(
      localStorage.getItem("mate-levels") ?? "[]"
    );
    return levels.reduce<LevelInfo[]>((acc, curr) => {
      const level: LevelInfo = JSON.parse(localStorage.getItem(curr)!);
      if (level) acc.push(level);
      return acc;
    }, []);
  },
};
