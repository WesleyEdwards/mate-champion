import {
  Button,
  ButtonProps,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
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

export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { user, api, modifyUser } = useAuthContext();
  const { setGameMode } = useLevelContext();

  const [pauseModal, setPauseModal] = useState(false);

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

  const handlePause = (pause: boolean) => {
    setPauseModal(pause);
  };

  return (
    <>
      {screen === "home" && (
        <Button
          sx={{ width: "11rem", my: "2rem" }}
          onClick={() => {
            modifyStats({ ...emptyStats });
            setScreen("game");

            setGameMode("play");
            setToNoDevSettings();

            enterGameLoop({
              setUI: { modifyStats, handleLose, handlePause },
              gameMode: "play",
              levels: levelsInfo,
              setLevel: undefined,
            });
          }}
        >
          Play
        </Button>
      )}
      <Modal open={pauseModal} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>{"'ESC' to unpause"}</DialogContent>
          <Button
            onClick={() => {
              setGameMode("play");
              setScreen("home");
              setPauseModal(false);
            }}
          >
            Quit
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};
