import { createContext, useContext } from "react";
import { GameMode } from "./useAuth";
import { LevelInfo, PartialLevelInfo } from "../Game/models";

export type LevelsContextType = {
  modifyLevel: (level: Partial<LevelInfo>) => void;
  setEditingLevel: (editing: PartialLevelInfo | null) => void;
  editingLevel: LevelInfo | null;
  saveLevelToDb: (props?: {
    name?: string;
    public?: boolean;
    length?: number;
    grogSpeed?: number;
  }) => Promise<LevelInfo>;
  gameMode: GameMode;
  setGameMode: (show: GameMode) => void;
  ownedLevels: PartialLevelInfo[] | undefined;
  setOwnedLevels: React.Dispatch<
    React.SetStateAction<PartialLevelInfo[] | undefined>
  >;
  createLevel: (name: string) => Promise<LevelInfo>;
  deleteLevel: (level: string) => Promise<unknown>;
};

export const LevelsContext = createContext({} as LevelsContextType);

export const useLevelContext = () => useContext(LevelsContext);
