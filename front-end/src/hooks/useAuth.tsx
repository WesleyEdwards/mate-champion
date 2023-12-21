import { useEffect, useState } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";

export const useAuth = () => {
  const api = new Api(localStorage.getItem("mate-token"));
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (localStorage.getItem("mate-token")) {
      api.auth.getSelf().then(setUser);
    }
  }, []);

  const login = (body: LoginBody) => {
    api.auth.signIn(body).then(setUser);
  };

  const createAccount = (body: User & { password: string }) => {
    return api.auth.createAccount(body).then(setUser);
  };

  const logout = () => {
    localStorage.removeItem("mate-token");
    setUser(undefined);
  };

  const modifyUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  return { api, user, login, createAccount, logout, modifyUser };
};
