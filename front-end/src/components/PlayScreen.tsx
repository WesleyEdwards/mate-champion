import { Button } from "@mui/joy";
import { FC } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { enterGameLoop } from "../Game/Main";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { localStorageManager } from "../api/localStorageManager";
import { MCScreen } from "./GameEntry";
import levelsInfo from "../levels.json";
import { setToNoDevSettings } from "../Game/devSettings";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { useLevelContext } from "../hooks/useLevels";

export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { user, api, modifyUser } = useAuthContext();
  const { setGameMode } = useLevelContext();

  const { setModal } = usePauseModalContext();

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
      sx={{ width: "11rem", mb: "2rem" }}
      onClick={() => {
        modifyStats({ ...emptyStats, levelCreator: levelsInfo[0].creatorName });
        setScreen("game");

        setGameMode("play");
        setToNoDevSettings();

        window.stopLoop = false;
        enterGameLoop({
          setUI: {
            modifyStats,
            handleLose,
            handlePause: (pause) => setModal(pause ? "pause" : null),
          },
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
