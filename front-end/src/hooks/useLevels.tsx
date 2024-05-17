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
  const [originalLevel, setOriginalLevel] = useState<LevelInfo | null>(null);
  const [editingLevel, setEditingLevel] = useState<LevelInfo | null>(null);
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
    if (!originalLevel || !api) {
      return Promise.reject("Not working on a level");
    }

    if (!isLevelDirty(originalLevel, newLevel)) {
      return Promise.resolve(newLevel);
    }

    setEditingLevel({ ...newLevel });
    return api.level
      .modify(newLevel._id, getLevelDiff(originalLevel, newLevel))
      .then((res) => {
        updateLevelInOwned(res);
        setOriginalLevel({ ...res });
        return res;
      });
  };

  const modifyLevel: LevelsContextType["modifyLevel"] = ({
    level = {},
    saveToDb = false,
    discardChanges = false,
  }) => {
    if (saveToDb) {
      return saveLevelToDb({ ...editingLevel!, ...level });
    }
    if (discardChanges && originalLevel) {
      setEditingLevel({ ...originalLevel });
      return Promise.resolve();
    }
    setEditingLevel((prev) => (prev ? { ...prev, ...level } : null));
    return Promise.resolve();
  };

  const handleSetEditing: LevelsContextType["setEditingLevel"] = (level) => {
    if (!api) return Promise.reject();

    setOriginalLevel(null);
    setEditingLevel(null);
    if (level === null) {
      return Promise.resolve();
    }
    if ("platforms" in level) {
      setOriginalLevel(level);
      setEditingLevel(level);
      return Promise.resolve();
    }
    return api.level.detail(level._id).then((res) => {
      setOriginalLevel(res);
      setEditingLevel(res);
    });
  };

  const fetchOwnLevels = () => {
    if (!api) return Promise.reject();
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
      setEditingLevel(null);
      setOriginalLevel(null);
    });
  };

  useEffect(() => {
    if (user && user.userType !== "User") fetchOwnLevels();
  }, [user]);

  const levelIsDirty = useMemo(() => {
    if (!originalLevel || !editingLevel) return false;
    return Object.keys(getLevelDiff(originalLevel, editingLevel)).length > 0;
  }, [editingLevel]);

  const setGameMode = (mode: GameMode) => {
    if (mode === "idle") {
      window.stopLoop = true;
    }
    setCurrGameMode(mode);
  };

  return {
    modifyLevel,
    setEditingLevel: handleSetEditing,
    editingLevel,
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
    level?: Partial<LevelInfo>;
    saveToDb?: boolean;
    discardChanges?: boolean;
  }) => Promise<unknown>;
  setEditingLevel: (editing: PartialLevelInfo | LevelInfo | null) => void;
  editingLevel: LevelInfo | null;
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
