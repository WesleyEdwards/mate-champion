import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FullLevelInfo, LevelInfo } from "../Game/models";
import { Api } from "../api/Api";
import { GameMode } from "./useAuth";
import { User } from "../types";
import { getLevelDiff, isLevelDirty } from "../helpers";
import { LevelCache, useLevelCache } from "./levelCache";

export const useLevels: (params: {
  api: Api | undefined;
  user: User | undefined;
}) => LevelsContextType = ({ api, user }) => {
  const [level, setLevel] = useState<
    { original: FullLevelInfo; dirty: FullLevelInfo } | null | undefined
  >(null);

  const [currGameMode, setCurrGameMode] = useState<GameMode>("idle");
  const levelCache = useLevelCache(api!, user!);

  const handleSetEditing: LevelsContextType["setEditingLevel"] = (level) => {
    if (level === null) {
      setLevel(null);
      return Promise.resolve();
    }

    setLevel(undefined);
    console.log("levelhandleSetEdinting", level);
    return levelCache.read.getFull(level).then((levelFull) => {
      setLevel({ original: levelFull, dirty: levelFull });
    });
  };

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
    editingLevel: level === undefined ? "loading" : level?.dirty ?? null,
    gameMode: currGameMode,
    setGameMode,
    setEditingLevel: handleSetEditing,
    levelCache,
    levelIsDirty,
  } satisfies LevelsContextType;
};

export type LevelsContextType = {
  setEditingLevel: (editing: string | null) => void;
  editingLevel: FullLevelInfo | "loading" | null;
  gameMode: GameMode;
  setGameMode: (show: GameMode) => void;
  levelCache: LevelCache;
  levelIsDirty: boolean;
};

export const LevelsContext = createContext({} as LevelsContextType);

export const useLevelContext = () => useContext(LevelsContext);
