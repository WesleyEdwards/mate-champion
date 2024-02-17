import { useEffect, useMemo, useState } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { localStorageManager } from "../api/localStorageManager";
import { AuthContextType } from "./AuthContext";
import { LevelInfo } from "../Game/models";

export type GameMode = "play" | "edit" | "test";

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User>();
  const [originalLevel, setOriginalLevel] = useState<LevelInfo | null>(null);
  const [editingLevel, setEditingLevel] = useState<LevelInfo | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("play");

  const api = useMemo(() => new Api(localStorageManager.get("token")), []);

  useEffect(() => {
    if (localStorageManager.get("token")) {
      api.auth.getSelf().then(setUser);
    }
  }, []);

  const login = (body: LoginBody) => {
    return api.auth.signIn(body).then((u) => {
      localStorageManager.set("high-score", u);
      setUser(u);
    });
  };

  const createAccount = (body: User & { password: string }) => {
    return api.auth.createAccount(body).then(setUser);
  };

  const logout = () => {
    localStorageManager.remove("token");
    setUser(undefined);
  };

  const modifyUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const modifyLevel = (level: Partial<LevelInfo>) => {
    console.log("Modifying level", level);
    setEditingLevel((prev) => (prev ? { ...prev, ...level } : null));
  };

  const saveLevelToDb = (): Promise<LevelInfo> => {
    console.log("saveLevelToDb");
    if (!editingLevel || !originalLevel) {
      return Promise.reject("Not working on a level");
    }

    const diffLengths = (a: any[], b: any[]) => a.length !== b.length;

    const editedName = originalLevel.name !== editingLevel.name;
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
      name: editedName,
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

    if (Object.keys(partial).length === 0) return Promise.resolve(editingLevel);

    return api.level.modify(editingLevel._id, partial).then((res) => {
      handleSetEditing(res);
      return res;
    });
  };

  const handleSetEditing = (level: LevelInfo | null) => {
    setOriginalLevel(level ? { ...level } : null);
    setEditingLevel(level ? { ...level } : null);
  };

  return {
    api,
    user,
    login,
    createAccount,
    logout,
    modifyUser,
    modifyLevel,
    saveLevelToDb,
    setEditingLevel: handleSetEditing,
    editingLevel,
    gameMode,
    setGameMode,
  };
};
