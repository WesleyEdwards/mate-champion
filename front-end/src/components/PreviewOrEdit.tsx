import { Button, Stack } from "@mui/joy";
import { FC } from "react";
import { ScreenProps } from "./GameEntry";
import { emptyStats } from "../Game/helpers/utils";
import { Construction, PlayArrow } from "@mui/icons-material";
import { FullLevelInfo, LevelInfo } from "../Game/models";
import { useLevelContext } from "../hooks/useLevels";
import { useNavigator } from "../hooks/UseNavigator";
import { gameLoopEdit } from "../game2/editor/gameLoopEdit";
import { enterGameLoop } from "../game2/main";

export const PreviewOrEdit: FC<ScreenProps> = ({ modifyStats }) => {
  const { levelCache, editingLevel, setGameMode, setIsDirty } =
    useLevelContext();
  const { navigateTo } = useNavigator();

  return (
    <Stack gap="1rem" direction="row">
      <Button
        size="lg"
        fullWidth
        variant="outlined"
        endDecorator={<Construction />}
        onClick={() => {
          modifyStats({ ...emptyStats });
          navigateTo("game");
          window.stopLoop = false;

          setGameMode("edit");

          if (editingLevel === null || editingLevel === "loading") {
            return console.error("Invalid state");
          }

          gameLoopEdit({
            level: editingLevel,
            setIsDirty: () => setIsDirty(true),
            setLevel: (level: Partial<FullLevelInfo>) => {
              levelCache.update.modify(editingLevel!._id, level);
              setIsDirty(false);
            },
          });
        }}
      >
        Edit
      </Button>
      <Button
        size="lg"
        variant="outlined"
        endDecorator={<PlayArrow />}
        fullWidth
        onClick={() => {
          modifyStats({ ...emptyStats });
          navigateTo("game");
          window.stopLoop = false;

          setGameMode("test");
          if (editingLevel === null || editingLevel === "loading") {
            console.error("Invalid state");
            return;
          }
          enterGameLoop({
            setUI: {
              modifyStats: ({}) => {},
              handleLose: () => {},
              handlePause: () => {},
            },
            levels: [editingLevel],
          });
        }}
      >
        Preview
      </Button>
    </Stack>
  );
};
