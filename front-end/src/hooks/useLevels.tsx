import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LevelInfo, PartialLevelInfo } from "../Game/models";
import { Api } from "../api/Api";
import { GameMode } from "./useAuth";
import { User } from "../types";
import { getLevelDiff, isLevelDirty } from "../helpers";

export const useLevels: (params: {
  api: Api | undefined;
  user: User | undefined;
}) => LevelsContextType = ({ api, user }) => {
  const [level, setLevel] = useState<
    { original: LevelInfo; dirty: LevelInfo } | null | undefined
  >(null);

  const [currGameMode, setCurrGameMode] = useState<GameMode>("idle");
  const [ownedLevels, setOwnedLevels] = useState<PartialLevelInfo[]>();

  const updateLevelInOwned = (level: LevelInfo) => {
    setOwnedLevels((prev) => {
      if (!prev) return prev;
      const index = prev.findIndex((l) => l._id === level._id);
      if (index === -1) return prev;
      const copy = [...prev];
      copy[index] = level;
      return copy;
    });
  };

  const saveLevelToDb = (newLevel: LevelInfo): Promise<LevelInfo> => {
    if (!level || !api) {
      return Promise.reject("Not working on a level");
    }

    if (!isLevelDirty(level.original, newLevel)) {
      return Promise.resolve(newLevel);
    }

    const originalLevel = { ...level.original };
    setLevel({ original: newLevel, dirty: newLevel });
    return api.level
      .modify(newLevel._id, getLevelDiff(originalLevel, newLevel))
      .then((res) => {
        updateLevelInOwned(res);
        return res;
      });
  };

  const modifyLevel: LevelsContextType["modifyLevel"] = ({
    mod = {},
    saveToDb = false,
    discardChanges = false,
  }) => {
    if (!level) return Promise.reject("Not working on a level");

    if (saveToDb) {
      return saveLevelToDb({ ...level.dirty, ...mod });
    }
    if (discardChanges) {
      const originalLevel = { ...level.original };
      setLevel({ original: originalLevel, dirty: originalLevel });
      return Promise.resolve();
    }
    setLevel((prev) => (prev ? { ...prev, ...level } : null));
    return Promise.resolve();
  };

  const handleSetEditing: LevelsContextType["setEditingLevel"] = (level) => {
    if (!api) return Promise.reject();

    const levelSetter = (level: LevelInfo) => {
      setLevel({
        original: level,
        dirty: level,
      });
    };
    setLevel(undefined);

    if (level === null) {
      setLevel(null);
      return Promise.resolve();
    }
    if (typeof level !== "string") {
      setLevel({ original: level, dirty: level });
      return Promise.resolve();
    }
    return api.level.detail(level).then((res) => {
      levelSetter(res);
    });
  };

  const fetchOwnLevels = () => {
    if (!user || user?.userType === "User" || !api) {
      return;
    }
    setOwnedLevels(undefined);
    return api.level
      .queryPartial({ owner: user?._id ?? "" }, [
        "_id",
        "name",
        "owner",
        "public",
        "creatorName",
      ])
      .then((res) => setOwnedLevels(res as PartialLevelInfo[]));
  };

  const deleteLevel = (level: string) => {
    if (!api) return Promise.reject();
    return api.level.delete(level).then(() => {
      setOwnedLevels((prev) => prev?.filter((l) => l._id !== level));
      setLevel(null);
    });
  };

  useEffect(() => {
    fetchOwnLevels();
  }, [user]);

  const levelIsDirty = useMemo(() => {
    if (!level) return false;

    return Object.keys(getLevelDiff(level.original, level.dirty)).length > 0;
  }, [level?.dirty]);

  const setGameMode = (mode: GameMode) => {
    if (mode === "idle") {
      window.stopLoop = true;
    }
    setCurrGameMode(mode);
  };

  return {
    modifyLevel,
    setEditingLevel: handleSetEditing,
    editingLevel: level === undefined ? "loading" : level?.dirty ?? null,
    gameMode: currGameMode,
    setGameMode,
    ownedLevels,
    setOwnedLevels,
    deleteLevel,
    levelIsDirty,
  };
};

export type LevelsContextType = {
  modifyLevel: (params: {
    mod?: Partial<LevelInfo>;
    saveToDb?: boolean;
    discardChanges?: boolean;
  }) => Promise<unknown>;
  setEditingLevel: (editing: LevelInfo | string | null) => void;
  editingLevel: LevelInfo | "loading" | null;
  gameMode: GameMode;
  setGameMode: (show: GameMode) => void;
  ownedLevels: PartialLevelInfo[] | undefined;
  setOwnedLevels: React.Dispatch<
    React.SetStateAction<PartialLevelInfo[] | undefined>
  >;
  deleteLevel: (level: string) => Promise<unknown>;
  levelIsDirty: boolean;
};

export const LevelsContext = createContext({} as LevelsContextType);

export const useLevelContext = () => useContext(LevelsContext);
