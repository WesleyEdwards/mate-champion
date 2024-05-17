import { LevelInfo } from "./Game/models";

export function camelCaseToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

export const getLevelDiff = (
  original: LevelInfo,
  override: LevelInfo
): Partial<LevelInfo> => {
  return Object.entries(override).reduce((acc, [k, v]) => {
    if (k === "updatedAt") {
      return acc;
    }
    // @ts-ignore
    if (JSON.stringify(original[k as any]) !== JSON.stringify(v)) {
      (acc as any)[k] = v;
    }
    return acc;
  }, {} as Partial<LevelInfo>);
};

export const isLevelDirty = (original: LevelInfo, override: LevelInfo) => {
  return Object.keys(getLevelDiff(original, override)).length > 0;
};
