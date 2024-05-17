import {
  Button,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { MCScreen, ScreenProps } from "./GameEntry";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { Check, Edit, Undo } from "@mui/icons-material";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { DeleteLevel } from "./DeleteLevel";
import { LevelInfo } from "../Game/models";
import { isLevelDirty } from "../helpers";
import { useLevelContext } from "../hooks/useLevels";

export const EditLevelDetail: FC<ScreenProps> = ({
  modifyStats,
  changeScreen,
}) => {
  const { modifyLevel, editingLevel, levelIsDirty, setGameMode } =
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
        setLevel: (level: Partial<LevelInfo>) => modifyLevel({ level }),
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

  if (!editingLevel) {
    return (
      <Stack gap="1rem" alignItems="center" height="300px" mt="1rem">
        <Skeleton height="20px" variant="rectangular" />
        <Skeleton height="100%" variant="rectangular" />
      </Stack>
    );
  }
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
        onClick={() => {
          modifyLevel({
            level: { public: !editingLevel.public },
            saveToDb: true,
          });
        }}
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
