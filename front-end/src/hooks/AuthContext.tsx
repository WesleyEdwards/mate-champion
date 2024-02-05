import { createContext, useContext } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { LevelInfo } from "../Game/level-info/levelInfo";

type AuthContextType = {
  api: Api;
  login: (body: LoginBody) => Promise<unknown>;
  createAccount: (body: User & { password: string }) => Promise<unknown>;
  user?: User;
  logout: () => void;
  modifyUser: (body: Partial<User>) => void;
  creatingLevel: LevelInfo | null;
  setCreatingLevel: (level: LevelInfo) => void;
  modifyLevel: (level: Partial<LevelInfo>) => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);
