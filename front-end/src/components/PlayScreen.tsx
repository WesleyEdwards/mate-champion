import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { FC, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { enterGameLoop } from "../Game/Main";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { localStorageManager } from "../api/localStorageManager";
import { MCScreen } from "./GameEntry";
import { levelsInfo } from "../Game/level-info/levelInfo";

export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { user, api, modifyUser, modifyLevel } = useAuthContext();

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

  const handleClickPlay = () => {
    modifyStats({ ...emptyStats });
    setScreen("game");
    enterGameLoop(
      { modifyStats, handleLose, handlePause },
      levelsInfo,
      modifyLevel
    );
  };

  return (
    <>
      {screen === "home" && (
        <Button
          sx={{ width: "10rem", my: "2rem" }}
          size="lg"
          onClick={handleClickPlay}
        >
          Play Game
        </Button>
      )}
      <Modal open={pauseModal} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>{"'ESC' to unpause"}</DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};
