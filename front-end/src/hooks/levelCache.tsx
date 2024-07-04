import { useEffect, useState } from "react";
import { FullLevelInfo, LevelInfo, LevelMap } from "../Game/models";
import { Api } from "../api/Api";
import { User } from "../types";
import {
  getDetailsAndMap,
  getLevelDiff,
  objectsAreDifferent,
} from "../helpers";
import _ from "lodash";
import { levelCache, setLevelCache } from "../levelCache/cacheLocalStorage";

export type CacheObj = {
  public: string[] | undefined;
  owned: string[] | undefined;
  levelInfo: Record<string, LevelInfo>;
  levelMaps: Record<string, LevelMap>;
};

export const useLevelCache = (api: Api, user: User): LevelCache => {
  function updateInRecord<
    R extends "levelInfo" | "levelMaps",
    V extends R extends "levelInfo" ? LevelInfo : LevelMap
  >(record: R, value: V) {
    setLevelCache((prev) => ({
      ...prev,
      [record]: { ...prev[record], [value._id]: value },
    }));
  }

  const saveLevelToDb = async (
    newLevel: FullLevelInfo,
    original: FullLevelInfo
  ): Promise<FullLevelInfo> => {
    const originalLevel = { ...original };
    const diff = getLevelDiff(originalLevel, newLevel);

    if (Object.keys(diff.details).length > 0) {
      const res = await api.level.modify(original._id, diff.details);
      updateInRecord("levelInfo", res);
    }
    if (Object.keys(diff.map).length > 0) {
      const res = await api.level.modifyMap(original._id, diff.map);
      updateInRecord("levelMaps", res);
    }
    return newLevel;
  };

  const refreshCache = async (): Promise<CacheObj> => {
    if (!user || user?.userType === "User" || !api) {
      throw new Error("User must be authenticated.");
    }
    const owned = await api.level.query({ owner: user?._id ?? "" });
    const publicLevels = await api.level.query({ public: true });
    setLevelCache((prev) => {
      return {
        owned: owned.map((l) => l._id),
        public: publicLevels.map((l) => l._id),
        levelInfo: {
          ...owned.reduce((acc, l) => ({ ...acc, [l._id]: l }), {}),
          ...publicLevels.reduce((acc, l) => ({ ...acc, [l._id]: l }), {}),
        },
        levelMaps: prev.levelMaps,
      };
    });
    return levelCache();
  };

  const modifyLevel: LevelCache["update"]["modify"] = async (id, mod) => {
    const level = await getFull(id);
    const updated = { ...level, ...mod };
    const { details, map } = getDetailsAndMap({ ...updated });

    updateInRecord("levelInfo", details);
    updateInRecord("levelMaps", map);
    if (objectsAreDifferent({ ...level }, { ...updated })) {
      await saveLevelToDb(updated, level);
    }

    if (mod.public !== undefined) {
      refreshCache();
    }
  };

  const deleteLevel: LevelCache["update"]["delete"] = async (level: string) => {
    await api.level.delete(level);
    setLevelCache((prev) => {
      const { [level]: _, ...levelInfo } = prev.levelInfo;
      const { [level]: __, ...levelMaps } = prev.levelMaps;
      return {
        ...prev,
        owned: prev.owned?.filter((l) => l !== level),
        public: prev.public?.filter((l_1) => l_1 !== level),
        levelInfo,
        levelMaps,
      };
    });
  };

  const getFull: LevelCache["read"]["getFull"] = async (id) => {
    const cachedDetails = levelCache().levelInfo[id];
    const cachedMap = levelCache().levelMaps[id];
    if (cachedDetails && cachedMap) {
      return { ...cachedDetails, ...cachedMap };
    }
    const details = cachedDetails ?? (await api.level.detail(id));
    const map = cachedMap ?? (await api.level.levelMapDetail(id));

    if (!cachedDetails) {
      updateInRecord("levelInfo", details);
    }
    if (!cachedMap) {
      updateInRecord("levelMaps", map);
    }
    return { ...details, ...map };
  };

  const create: LevelCache["update"]["create"] = async (level) => {
    const levelInfo = await api.level.create(level);
    const map = await api.level.levelMapDetail(levelInfo._id);
    updateInRecord("levelInfo", levelInfo);
    updateInRecord("levelMaps", map);
    setLevelCache((prev) => ({
      ...prev,
      owned: prev.owned ? [...prev.owned, levelInfo._id] : prev.owned,
      levelInfo: { ...prev.levelInfo, [levelInfo._id]: levelInfo },
    }));
    return { ...levelInfo, ...map };
  };

  const getLevelInfoByIds = (ids: string[]) =>
    Promise.resolve(ids.map((id) => levelCache().levelInfo[id]));

  useEffect(() => {
    if (user) refreshCache();
  }, [user]);

  return {
    read: {
      owned: async () => {
        if (!levelCache().owned) {
          await refreshCache();
        }
        if (levelCache().owned) {
          return getLevelInfoByIds(levelCache().owned ?? []);
        } else {
          throw new Error("No owned levels in level cache");
        }
      },
      public: async () => {
        if (!levelCache().public) {
          await refreshCache();
        }
        if (levelCache().public) {
          return getLevelInfoByIds(levelCache().public ?? []);
        } else {
          throw new Error("No public levels in level cache");
        }
      },
      getFull,
    },
    update: {
      delete: deleteLevel,
      modify: modifyLevel,
      create,
    },
  } satisfies LevelCache;
};

export type LevelCache = {
  read: {
    owned: () => Promise<LevelInfo[]>;
    public: () => Promise<LevelInfo[]>;
    getFull: (id: string) => Promise<FullLevelInfo>;
  };
  update: {
    delete: (level: string) => Promise<void>;
    create: (level: LevelInfo) => Promise<FullLevelInfo>;
    modify: (id: string, mod: Partial<FullLevelInfo>) => Promise<unknown>;
  };
};
