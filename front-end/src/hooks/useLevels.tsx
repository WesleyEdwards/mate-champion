import { useState } from "react";
import { LevelInfo, PartialLevelInfo } from "../Game/models";
import { LevelsContextType } from "./LevelsContext";
import { Api } from "../api/Api";
import { GameMode } from "./useAuth";
import { User } from "../types";

export const useLevels: (params: {
  api: Api | undefined;
  user: User | undefined;
}) => LevelsContextType = ({ api, user }) => {
  const [originalLevel, setOriginalLevel] = useState<LevelInfo | null>(null);
  const [editingLevel, setEditingLevel] = useState<LevelInfo | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("play");
  const [ownedLevels, setOwnedLevels] = useState<PartialLevelInfo[]>();

  const saveLevelToDb = (params?: {
    name?: string;
    public?: boolean;
  }): Promise<LevelInfo> => {
    if (!editingLevel || !originalLevel || !api) {
      return Promise.reject("Not working on a level");
    }

    const diffLengths = (a: any[], b: any[]) => a.length !== b.length;

    const editFloors =
      diffLengths(originalLevel.floors, editingLevel.floors) ||
      !originalLevel.floors.every((floor) =>
        editingLevel.floors.find(
          (f) => f.x === floor.x && f.color === floor.color
        )
      );
    const editPlatforms =
      diffLengths(originalLevel.platforms, editingLevel.platforms) ||
      !originalLevel.platforms.every((floor) =>
        editingLevel.platforms.find((f) => f.x === floor.x && f.y === floor.y)
      );
    const editPackages =
      diffLengths(originalLevel.packages, editingLevel.packages) ||
      !originalLevel.packages.every((pack) =>
        editingLevel.packages.find((p) => p.x === pack.x && p.y === pack.y)
      );
    const editOpps =
      diffLengths(originalLevel.opponents.grog, editingLevel.opponents.grog) ||
      !originalLevel.opponents.grog.every((opponent) =>
        editingLevel.opponents.grog.find(
          (o) =>
            o.initPos.x === opponent.initPos.x &&
            o.initPos.y === opponent.initPos.y
        )
      );

    const list: Partial<Record<keyof LevelInfo, boolean>> = {
      floors: editFloors,
      platforms: editPlatforms,
      opponents: editOpps,
      packages: editPackages,
    };

    const partial: Partial<LevelInfo> = Object.entries(list).reduce(
      (acc, [k, v]) => {
        const key = k as keyof LevelInfo;
        if (v) {
          (acc[key] as any) = editingLevel[key];
        }
        return acc;
      },
      {} as Partial<LevelInfo>
    );

    if (params?.name) partial["name"] = params.name;
    if (params?.public) partial["public"] = params.public;

    if (Object.keys(partial).length === 0) return Promise.resolve(editingLevel);

    return api.level.modify(editingLevel._id, partial).then((res) => {
      setOwnedLevels((prev) => {
        if (!prev) return prev;
        const index = prev.findIndex((l) => l._id === res._id);
        if (index === -1) return prev;
        const copy = [...prev];
        copy[index] = res;
        return copy;
      });
      handleSetEditing(res);
      return res;
    });
  };

  const modifyLevel = (level: Partial<LevelInfo>) => {
    setEditingLevel((prev) => (prev ? { ...prev, ...level } : null));
  };

  const handleSetEditing = (level: PartialLevelInfo | null) => {
    if (!api) return Promise.reject();
    if (level === null) {
      setOriginalLevel(null);
      return setEditingLevel(null);
    }
    api.level.detail(level._id).then((res) => {
      setOriginalLevel(res);
      setEditingLevel(res);
    });
  };

  const createLevel = async (name: string) => {
    if (!api) return Promise.reject();
    const created = await api.level.create({
      _id: crypto.randomUUID(),
      owner: user?._id ?? "",
      public: false,
      name: name,
      opponents: { grog: [] },
      packages: [],
      floors: [{ x: -500, width: 7000, color: "green" }],
      platforms: [],
    });
    setOriginalLevel(created);
    setEditingLevel(created);
    setOwnedLevels((prev) => (prev ? [...prev, created] : prev));
    return created;
  };

  const fetchOwnLevels = () => {
    if (!api) return Promise.reject();
    if (ownedLevels) return Promise.resolve();
    setOwnedLevels(undefined);
    return api.level
      .queryPartial({ owner: user?._id ?? "" }, [
        "_id",
        "name",
        "owner",
        "public",
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

  return {
    modifyLevel,
    setEditingLevel: handleSetEditing,
    editingLevel,
    saveLevelToDb,
    gameMode,
    setGameMode,
    ownedLevels,
    setOwnedLevels,
    fetchOwnLevels,
    deleteLevel,
    createLevel,
  };
};
