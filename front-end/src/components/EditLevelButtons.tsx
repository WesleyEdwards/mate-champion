import {
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { MCScreen } from "./GameEntry";
import { PlayStats } from "../Game/helpers/types";
import { useLevelContext } from "../hooks/LevelsContext";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { Check, Edit, Undo } from "@mui/icons-material";

export const EditLevelButtons: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { modifyLevel, editingLevel, setGameMode, saveLevelToDb } =
    useLevelContext();

  if (!editingLevel) return null;

  const [pauseModal, setPauseModal] = useState(false);
  const [editingName, setEditingName] = useState<string>();

  const handleEnterGamePlay = (gamePlay: "edit" | "test") => {
    modifyStats({ ...emptyStats });
    setScreen("game");

    setGameMode(gamePlay);

    const constantParams = {
      setUI: { modifyStats, handleLose: () => {}, handlePause: setPauseModal },
      gameMode: gamePlay,
    };

    const params = {
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
      {screen === "home" && (
        <>
          {editingName === undefined ? (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <div></div>
              <Typography level="h1">{editingLevel.name}</Typography>
              <IconButton onClick={() => setEditingName(editingLevel.name)}>
                <Edit />
              </IconButton>
            </Stack>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <div></div>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
              <Stack direction="row" gap="1rem">
                <IconButton
                  variant="plain"
                  onClick={() => setEditingName(undefined)}
                >
                  <Undo />
                </IconButton>
                <IconButton
                  onClick={() => {
                    saveLevelToDb(editingName);
                    setEditingName(undefined);
                  }}
                >
                  <Check />
                </IconButton>
              </Stack>
            </Stack>
          )}
          <Stack direction="row" gap="1rem">
            <Button
              sx={{ width: "11rem", my: "2rem" }}
              onClick={() => handleEnterGamePlay("edit")}
            >
              Edit Level
            </Button>
            <Button
              sx={{ width: "11rem", my: "2rem" }}
              onClick={() => handleEnterGamePlay("test")}
            >
              Test Level
            </Button>
          </Stack>
        </>
      )}
      <Modal open={pauseModal} onClose={() => {}}>
        <ModalDialog>
          <DialogTitle>Pause</DialogTitle>
          <DialogContent>{"'ESC' to unpause"}</DialogContent>
          <Button
            onClick={() => {
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
