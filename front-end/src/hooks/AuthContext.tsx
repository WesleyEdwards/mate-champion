import { createContext, useContext } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";

type AuthContextType = {
  api: Api;
  login: (body: LoginBody) => Promise<unknown>;
  createAccount: (body: User & { password: string }) => Promise<unknown>;
  user?: User;
  logout: () => void;
  modifyUser: (body: Partial<User>) => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);
