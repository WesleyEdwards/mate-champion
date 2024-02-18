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
import { modifyDevSettings } from "../Game/devSettings";
import { GameMode } from "../hooks/useAuth";
import { useLevelContext } from "../hooks/LevelsContext";

export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { user, api, modifyUser } = useAuthContext();
  const { modifyLevel, editingLevel, setGameMode } = useLevelContext();

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

    setGameMode(gamePlay);

    const constantParams = {
      setUI: { modifyStats, handleLose, handlePause },
      gameMode: gamePlay,
    };

    const params = {
      play: {
        levels: levelsInfo,
        setLevel: undefined,
      },
      edit: {
        levels: editingLevel ? [editingLevel] : [],
        setLevel: modifyLevel,
      },
      test: {
        levels: editingLevel ? [editingLevel] : [],
        setLevel: undefined,
      },
    }[gamePlay];

    enterGameLoop({ ...params, ...constantParams });
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
                Edit Level
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
              setScreen("home");
            }}
          >
            Quit
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};
