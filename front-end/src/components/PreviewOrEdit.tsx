import { Button, Stack, Textarea } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { ScreenProps } from "./GameEntry";
import { emptyStats } from "../Game/helpers/utils";
// import { enterGameLoop } from "../Game/Main";
import { Construction, PlayArrow } from "@mui/icons-material";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { DeleteLevel } from "./DeleteLevel";
import { FullLevelInfo, LevelInfo } from "../Game/models";
import { useLevelContext } from "../hooks/useLevels";
import { useNavigator } from "../hooks/UseNavigator";
import { VisibilityIcon } from "./MyLevels";
import { gameLoopEdit } from "../game2/editor/gameLoopEdit";

export const PreviewOrEdit: FC<ScreenProps> = ({ modifyStats }) => {
  const { levelCache, editingLevel, setGameMode } = useLevelContext();
  const { setModal } = usePauseModalContext();
  const { navigateTo } = useNavigator();

  const handleEnterGamePlay = (gamePlay: "edit" | "test") => {
    if (editingLevel === "loading") return;
    modifyStats({ ...emptyStats });
    navigateTo("game");
    window.stopLoop = false;

    setGameMode(gamePlay);

    if (editingLevel === null) {
      console.error("It's null");
      return;
    }
    if (gamePlay === "edit") {
      gameLoopEdit({
        level: editingLevel,
        setLevel: (level: Partial<FullLevelInfo>) =>
          levelCache.update.modify(editingLevel!._id, level),
      });
    }

    // const params = {
    //   edit: {
    //     setUI: {
    //       modifyStats,
    //       handleLose: () => {},
    //       handlePause: (pause: boolean) => {
    //         return setModal(pause ? "pause" : null);
    //       },
    //     },
    //     gameMode: gamePlay,
    //     levels: editingLevel ? [editingLevel] : [],
    //     setLevel: (level: Partial<FullLevelInfo>) =>
    //       levelCache.update.modify(editingLevel!._id, level),
    //   },
    //   test: {
    //     setUI: {
    //       modifyStats,
    //       handleLose: () => {},
    //       handlePause: (pause: boolean) => {
    //         return setModal(pause ? "pause" : null);
    //       },
    //     },
    //     gameMode: gamePlay,
    //     levels: editingLevel ? [editingLevel] : [],
    //     setLevel: undefined,
    //   },
    // }[gamePlay];

    // enterGameLoop(params);
  };

  return (
    <Stack gap="1rem" direction="row">
      <Button
        size="lg"
        fullWidth
        variant="outlined"
        endDecorator={<Construction />}
        onClick={() => handleEnterGamePlay("edit")}
      >
        Edit
      </Button>
      <Button
        size="lg"
        variant="outlined"
        endDecorator={<PlayArrow />}
        fullWidth
        onClick={() => handleEnterGamePlay("test")}
      >
        Preview
      </Button>
    </Stack>
  );
};
