import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { MCScreen, ScreenProps } from "./GameEntry";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import {
  Check,
  Construction,
  Edit,
  PlayArrow,
  Undo,
} from "@mui/icons-material";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { DeleteLevel } from "./DeleteLevel";
import editingImage from "../assets/editing.png";
import { LevelInfo } from "../Game/models";
import { isLevelDirty } from "../helpers";
import { useLevelContext } from "../hooks/useLevels";
import { useNavigator } from "../hooks/UseNavigator";
import { VisibilityIcon } from "./MyLevels";

export const EditLevelDetail: FC<ScreenProps> = ({ modifyStats }) => {
  const { modifyLevel, editingLevel, setGameMode } = useLevelContext();
  const { navigateTo } = useNavigator();

  const { setModal } = usePauseModalContext();

  const handleEnterGamePlay = (gamePlay: "edit" | "test") => {
    modifyStats({ ...emptyStats });
    navigateTo("game");
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
      <Stack
        gap="1rem"
        alignItems="center"
        height="300px"
        width="400px"
        mt="1rem"
      >
        <Skeleton height="20px" variant="rectangular" />
        <Skeleton height="100%" variant="rectangular" />
      </Stack>
    );
  }
  return (
    <Stack gap="2rem" width="100%" flexGrow={1}>
      <Textarea
        value={editingLevel.description ?? ""}
        placeholder="Description"
        minRows={2}
        onChange={(e) => {
          modifyLevel({
            level: { description: e.target.value },
            saveToDb: false,
          });
        }}
        sx={{ flexGrow: 1 }}
      />
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

      <FormControl>
        <Checkbox
          label="Visibility"
          checked={editingLevel.public}
          onChange={(e) => {
            modifyLevel({
              level: { public: e.target.checked },
              saveToDb: true,
            });
          }}
        />
        <FormHelperText>
          <VisibilityIcon publicLevel={editingLevel.public} />
          {editingLevel.public
            ? "Anyone can see this level"
            : "Only you can see this level"}
        </FormHelperText>
      </FormControl>

      <Divider />

      <DeleteLevel
        name={editingLevel.name}
        id={editingLevel._id}
        showWordDelete
      />
    </Stack>
  );
};
