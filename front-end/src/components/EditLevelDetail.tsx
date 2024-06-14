import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Skeleton,
  Stack,
  Textarea,
} from "@mui/joy";
import { FC } from "react";
import { ScreenProps } from "./GameEntry";
import { emptyStats } from "../Game/helpers/utils";
import { enterGameLoop } from "../Game/Main";
import { Construction, PlayArrow } from "@mui/icons-material";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { DeleteLevel } from "./DeleteLevel";
import { LevelInfo } from "../Game/models";
import { useLevelContext } from "../hooks/useLevels";
import { useNavigator } from "../hooks/UseNavigator";
import { VisibilityIcon } from "./MyLevels";

export const EditLevelDetail: FC<ScreenProps> = ({ modifyStats }) => {
  const { modifyLevel, editingLevel, setGameMode, levelIsDirty } =
    useLevelContext();
  const { navigateTo } = useNavigator();
  const { setModal } = usePauseModalContext();

  const handleEnterGamePlay = (gamePlay: "edit" | "test") => {
    if (editingLevel === "loading") return;
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
        setLevel: (level: Partial<LevelInfo>) => modifyLevel({ mod: level }),
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

  const saveForm = () => {
    modifyLevel({ mod: {}, saveToDb: true });
  };

  if (editingLevel === "loading") {
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

  if (!editingLevel) {
    navigateTo("home");
    return null;
  }

  return (
    <Stack gap="2rem" width="100%" flexGrow={1}>
      <Textarea
        value={editingLevel.description ?? ""}
        placeholder="Description"
        minRows={2}
        onChange={(e) => {
          modifyLevel({
            mod: { description: e.target.value },
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
          label="Public"
          checked={editingLevel.public}
          onChange={(e) => {
            modifyLevel({
              mod: { public: e.target.checked },
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

      <Button
        sx={{ alignSelf: "flex-end" }}
        onClick={saveForm}
        disabled={!levelIsDirty}
      >
        Save
      </Button>

      <Divider />

      <DeleteLevel
        name={editingLevel.name}
        id={editingLevel._id}
        showWordDelete
      />
    </Stack>
  );
};
