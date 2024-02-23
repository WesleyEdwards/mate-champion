import { useEffect, useMemo, useState } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { localStorageManager } from "../api/localStorageManager";
import { AuthContextType } from "./AuthContext";

export type GameMode = "play" | "edit" | "test" | "idle";

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User>();

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

  return {
    api,
    user,
    login,
    createAccount,
    logout,
    modifyUser,
  };
};
