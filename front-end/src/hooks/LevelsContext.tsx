import { createContext, useContext } from "react";
import { GameMode } from "./useAuth";
import { LevelInfo } from "../Game/models";

export type LevelsContextType = {
  modifyLevel: (level: Partial<LevelInfo>) => void;
  setEditingLevel: (editing: LevelInfo | null) => void;
  editingLevel: LevelInfo | null;
  saveLevelToDb: (name?: string) => Promise<LevelInfo>;
  gameMode: GameMode;
  setGameMode: (show: GameMode) => void;
  ownedLevels: LevelInfo[] | undefined;
  setOwnedLevels: React.Dispatch<React.SetStateAction<LevelInfo[] | undefined>>;
  createLevel: (name: string) => Promise<LevelInfo>;
  fetchOwnLevels: () => Promise<unknown>;
  deleteLevel: (level: string) => Promise<unknown>;
};

export const LevelsContext = createContext({} as LevelsContextType);

export const useLevelContext = () => useContext(LevelsContext);
