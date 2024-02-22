import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { FC, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { enterGameLoop } from "../Game/Main";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { localStorageManager } from "../api/localStorageManager";
import { MCScreen } from "./GameEntry";
import levelsInfo from "../levels.json";
import { GameMode } from "../hooks/useAuth";
import { useLevelContext } from "../hooks/LevelsContext";
import { setToNoDevSettings } from "../Game/devSettings";
import { usePauseModalContext } from "../hooks/PauseModalContext";


export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { user, api, modifyUser } = useAuthContext();
  const { setGameMode } = useLevelContext();

  const { openPauseModal } = usePauseModalContext();

  const handleLose = (score: number) => {
    const personalHigh =
      user?.highScore ?? parseInt(localStorageManager.get("high-score") ?? "0");
    const isPersonalHigh = score > personalHigh;
    if (isPersonalHigh) {
      localStorageManager.set("high-score", score.toString());
      if (user) {
        api.score.create({
          _id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score: score,
          userId: user._id,
        });
        modifyUser({ highScore: score });
        modifyStats({ score });
      }
      return setScreen("personalHigh");
    }
    return setScreen("highScores");
  };

  if (screen !== "home") return null;

  return (
    <Button
      sx={{ width: "11rem", my: "2rem" }}
      onClick={() => {
        modifyStats({ ...emptyStats });
        setScreen("game");

        setGameMode("play");
        setToNoDevSettings();

        enterGameLoop({
          setUI: { modifyStats, handleLose, handlePause: openPauseModal },
          gameMode: "play",
          levels: levelsInfo,
          setLevel: undefined,
        });
      }}
    >
      Play
    </Button>
  );
};
