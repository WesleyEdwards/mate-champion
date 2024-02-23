import {
  Button,
  IconButton,
  Input,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { MCScreen } from "./GameEntry";
import { PlayStats } from "../Game/helpers/types";
import { useLevelContext } from "../hooks/LevelsContext";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { Check, Edit, Undo } from "@mui/icons-material";
import { usePauseModalContext } from "../hooks/PauseModalContext";

export const EditLevelButtons: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void;
  screen: MCScreen;
  setScreen: (screen: MCScreen) => void;
}> = ({ modifyStats, setScreen, screen }) => {
  const { modifyLevel, editingLevel, setGameMode, saveLevelToDb } =
    useLevelContext();

  if (!editingLevel) return null;

  const [editingName, setEditingName] = useState<string>();

  const { setModal } = usePauseModalContext();

  const handleEnterGamePlay = (gamePlay: "edit" | "test") => {
    modifyStats({ ...emptyStats });
    setScreen("game");

    setGameMode(gamePlay);

    const params = {
      edit: {
        setUI: {
          modifyStats,
          handleLose: () => {},
          handlePause: (pause: boolean) => {
            return setModal(pause ? "save" : null);
          },
        },
        gameMode: gamePlay,
        levels: editingLevel ? [editingLevel] : [],
        setLevel: modifyLevel,
      },
      test: {
        setUI: {
          modifyStats,
          handleLose: () => {},
          handlePause: (pause: boolean) => {
            return setModal(pause ? "save" : null);
          },
        },
        gameMode: gamePlay,
        levels: editingLevel ? [editingLevel] : [],
        setLevel: undefined,
      },
    }[gamePlay];

    enterGameLoop(params);
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
              <Tooltip title="Edit Name">
                <IconButton onClick={() => setEditingName(editingLevel.name)}>
                  <Edit />
                </IconButton>
              </Tooltip>
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
                <Tooltip title="Undo">
                  <IconButton
                    variant="plain"
                    onClick={() => setEditingName(undefined)}
                  >
                    <Undo />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save">
                  <IconButton
                    onClick={() => {
                      saveLevelToDb({ name: editingName });
                      setEditingName(undefined);
                    }}
                  >
                    <Check />
                  </IconButton>
                </Tooltip>
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
          {editingLevel.public ? (
            <Typography level="body-md">
              This level is <b>public</b>. Anyone can play it.
            </Typography>
          ) : (
            <Typography level="body-md">
              This level is <b>private</b>. Only you can play it.
            </Typography>
          )}
          <Button
            sx={{ width: "11rem" }}
            onClick={() => saveLevelToDb({ public: !editingLevel.public })}
            variant="outlined"
          >
            Make {editingLevel.public ? "Private" : "Public"}
          </Button>
        </>
      )}
    </>
  );
};
