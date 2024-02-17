import { createContext, useContext } from "react";
import { Api } from "../api/Api";
import { LoginBody, User } from "../types";
import { LevelInfo } from "../Game/models";
import { GameMode } from "./useAuth";

export type AuthContextType = {
  api: Api;
  login: (body: LoginBody) => Promise<unknown>;
  createAccount: (body: User & { password: string }) => Promise<unknown>;
  user?: User;
  logout: () => void;
  modifyUser: (body: Partial<User>) => void;
  modifyLevel: (level: Partial<LevelInfo>) => void;
  setEditingLevel: (editing: LevelInfo | null) => void;
  editingLevel: LevelInfo | null;
  saveLevelToDb: () => Promise<LevelInfo>;
  gameMode: GameMode;
  setGameMode: (show: GameMode) => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);
