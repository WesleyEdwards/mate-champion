import { useEffect, useState } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { localStorageManager } from "../api/localStorageManager";

export const useAuth = () => {
  const api = new Api(localStorageManager.get("token"));
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (localStorageManager.get("token")) {
      api.auth.getSelf().then(setUser);
    }
  }, []);

  const login = (body: LoginBody) => {
    return api.auth.signIn(body).then(setUser);
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

  return { api, user, login, createAccount, logout, modifyUser };
};
