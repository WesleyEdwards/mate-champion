import { createContext, useContext } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { LevelInfo } from "../Game/models";

export type AuthContextType = {
  api: Api;
  login: (body: LoginBody) => Promise<unknown>;
  createAccount: (body: User & { password: string }) => Promise<unknown>;
  user?: User;
  logout: () => void;
  modifyUser: (body: Partial<User>) => void;
  creatingLevel: LevelInfo | null;
  setLevelCreating: (level: LevelInfo | null) => void;
  modifyLevel: (level: Partial<LevelInfo>) => void;
  saveLevelToDb: () => void;
  deleteFromDatabase: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);
