import {
  Button,
  IconButton,
  Input,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { MCScreen, ScreenProps } from "./GameEntry";
import { useLevelContext } from "../hooks/LevelsContext";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { Check, Edit, Undo } from "@mui/icons-material";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { DeleteLevel } from "./DeleteLevel";

export const EditLevelDetail: FC<ScreenProps> = ({
  modifyStats,
  changeScreen,
}) => {
  const { modifyLevel, editingLevel, setGameMode, saveLevelToDb } =
    useLevelContext();

  const { setModal } = usePauseModalContext();

  const handleEnterGamePlay = (gamePlay: "edit" | "test") => {
    modifyStats({ ...emptyStats });
    changeScreen("game");
    window.stopLoop = false;

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
            return setModal(pause ? "pause" : null);
          },
        },
        gameMode: gamePlay,
        levels: editingLevel ? [editingLevel] : [],
        setLevel: undefined,
      },
    }[gamePlay];

    enterGameLoop(params);
  };

  if (!editingLevel) return null;

  return (
    <Stack alignItems="center" gap="1rem">
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

      <DeleteLevel
        name={editingLevel.name}
        id={editingLevel._id}
        showWordDelete
      />
    </Stack>
  );
};
