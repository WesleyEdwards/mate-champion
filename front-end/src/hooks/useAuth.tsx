import { useEffect, useMemo, useState } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { localStorageManager } from "../api/localStorageManager";
import { AuthContextType } from "./AuthContext";
import { modifyDevSettings } from "../Game/devSettings";
import { LevelInfo } from "../Game/models";

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User>();
  const [creatingLevel, setCreatingLevel] = useState<LevelInfo | null>(null);
  const [editingLevel, setEditingLevel] = useState(false);

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
    console.log("modifying level: ", level);
    setCreatingLevel((prev) => (prev ? { ...prev, ...level } : null));
  };

  const saveLevelToDb = (): Promise<unknown> => {
    console.log("saveLevelToDb");
    if (!creatingLevel) {
      return Promise.reject("Not working on a level");
    }
    return api.level.modify(creatingLevel._id, {
      floors: creatingLevel.floors,
      platforms: creatingLevel.platforms,
      opponents: creatingLevel.opponents,
    });
  };

  const deleteFromDatabase = () => {
    if (!creatingLevel) {
      return;
    }
    localStorageManager.removeLevel(creatingLevel);
    setCreatingLevel(null);
  };

  const setLevelCreating = (level: LevelInfo | null) => {
    setCreatingLevel(level);
    modifyDevSettings("pauseOpponent", !!level);
  };

  return {
    api,
    user,
    login,
    createAccount,
    logout,
    modifyUser,
    creatingLevel,
    setLevelCreating: setLevelCreating,
    modifyLevel,
    saveLevelToDb,
    deleteFromDatabase,
    setEditingLevel,
    editingLevel
  };
};
