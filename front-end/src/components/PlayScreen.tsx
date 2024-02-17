import {
  Button,
  ButtonProps,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { FC, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";
import { enterGameLoop } from "../Game/Main";
import { PlayStats } from "../Game/helpers/types";
import { emptyStats } from "../Game/helpers/utils";
import { localStorageManager } from "../api/localStorageManager";
import { MCScreen } from "./GameEntry";
import levelsInfo from "../levels.json";
import { DevSettings, modifyDevSettings } from "../Game/devSettings";
import { GameMode } from "../hooks/useAuth";

export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { user, api, modifyUser, modifyLevel, editingLevel, setGameMode } =
    useAuthContext();

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

  const handleEnterGamePlay = (gamePlay: GameMode) => {
    modifyStats({ ...emptyStats });
    setScreen("game");

    modifyDevSettings("pauseOpponent", gamePlay === "edit");
    setGameMode(gamePlay);

    const params = {
      play: {
        setUI: { modifyStats, handleLose, handlePause },
        levels: levelsInfo,
        setLevel: undefined,
      },
      edit: {
        setUI: { modifyStats, handleLose, handlePause },
        levels: editingLevel ? [editingLevel] : [],
        setLevel: modifyLevel,
      },
      test: {
        setUI: { modifyStats, handleLose, handlePause },
        levels: editingLevel ? [editingLevel] : [],
        setLevel: undefined,
      },
    }[gamePlay];

    enterGameLoop(params);
  };

  return (
    <>
      {(() => {
        if (screen !== "home") return null;
        const buttonProps: ButtonProps = {
          sx: { width: "11rem", my: "2rem" },
          size: "lg",
        };
        if (editingLevel) {
          return (
            <Stack direction="row" gap="1rem">
              <Button
                {...buttonProps}
                onClick={() => handleEnterGamePlay("edit")}
              >
                Level Editor
              </Button>
              <Button
                {...buttonProps}
                onClick={() => handleEnterGamePlay("test")}
              >
                Test Level
              </Button>
            </Stack>
          );
        }
        return (
          <Button {...buttonProps} onClick={() => handleEnterGamePlay("play")}>
            Play
          </Button>
        );
      })()}
      <Modal open={pauseModal} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>{"'ESC' to unpause"}</DialogContent>
          <Button
            onClick={() => {
              setGameMode("play");
              setScreen(editingLevel ? "levelCreator" : "home");
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
