import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LevelInfo, PartialLevelInfo } from "../Game/models";
import { Api } from "../api/Api";
import { GameMode } from "./useAuth";
import { User } from "../types";
import { getLevelDiff } from "../helpers";

export const useLevels: (params: {
  api: Api | undefined;
  user: User | undefined;
}) => LevelsContextType = ({ api, user }) => {
  const [originalLevel, setOriginalLevel] = useState<LevelInfo | null>(null);
  const [editingLevel, setEditingLevel] = useState<LevelInfo | null>(null);
  const [currGameMode, setCurrGameMode] = useState<GameMode>("idle");
  const [ownedLevels, setOwnedLevels] = useState<PartialLevelInfo[]>();

  const saveLevelToDb = (newLevel: LevelInfo): Promise<LevelInfo> => {
    if (!originalLevel || !api) {
      return Promise.reject("Not working on a level");
    }

    const partial: Partial<LevelInfo> = getLevelDiff(originalLevel, newLevel);

    if (Object.keys(partial).length === 0) return Promise.resolve(newLevel);

    setEditingLevel({ ...newLevel });
    return api.level.modify(newLevel._id, partial).then((res) => {
      setOwnedLevels((prev) => {
        if (!prev) return prev;
        const index = prev.findIndex((l) => l._id === res._id);
        if (index === -1) return prev;
        const copy = [...prev];
        copy[index] = res;
        return copy;
      });
      setOriginalLevel({ ...res });
      return res;
    });
  };

  const modifyLevel: LevelsContextType["modifyLevel"] = ({
    level,
    saveToDb = false,
  }: {
    level: Partial<LevelInfo>;
    saveToDb?: boolean;
  }) => {
    console.log("modifyLevel")
    if (saveToDb) {
      return saveLevelToDb({ ...editingLevel!, ...level });
    }
    setEditingLevel((prev) => (prev ? { ...prev, ...level } : null));
    return Promise.resolve();
  };

  const handleSetEditing = (level: PartialLevelInfo | null) => {
    console.log("handleSetEditing")
    if (!api) return Promise.reject();
    if (level === null) {
      setOriginalLevel(null);
      setEditingLevel(null);
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
    console.log(getLevelDiff(originalLevel, editingLevel));
    return Object.keys(getLevelDiff(originalLevel, editingLevel)).length > 0;
  }, [editingLevel]);

  const setGameMode = (mode: GameMode) => {
    if (mode === "idle") {
      window.stopLoop = false;
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
    level: Partial<LevelInfo>;
    saveToDb?: boolean;
  }) => Promise<unknown>;
  setEditingLevel: (editing: PartialLevelInfo | null) => void;
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
