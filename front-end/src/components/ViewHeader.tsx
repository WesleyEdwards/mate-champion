import {
  Divider,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { MCScreen } from "./GameEntry";
import { ArrowBack, Check, Edit, Undo } from "@mui/icons-material";
import { FC, useState } from "react";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { useLevelContext } from "../hooks/useLevels";
import { CreateNewLevel } from "./CreateNewLevel";
import { useNavigator } from "../hooks/UseNavigator";

export const ViewHeaderSubScreen: FC<{
  title: string;
}> = ({ title }) => {
  const { navigateTo } = useNavigator();
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => navigateTo("home")}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">{title}</Typography>
        <div style={{ width: "2rem" }}></div>
      </Stack>
      <Divider />
    </Stack>
  );
};

export const LevelsHeader: FC = () => {
  const { navigateTo } = useNavigator();
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => navigateTo("home")}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">Levels</Typography>
        <CreateNewLevel
          text="Create"
          onCreate={() => navigateTo("editorDetail")}
        />
      </Stack>
      <Divider />
    </Stack>
  );
};

export const ViewHeaderMainScreen: FC<{ title: string }> = ({ title }) => {
  return (
    <Stack alignItems="center" width="100%">
      <Typography level="h2">{title}</Typography>
    </Stack>
  );
};

export const EditLevelDetailHeader: FC = () => {
  const { navigateTo } = useNavigator();
  const [editingName, setEditingName] = useState<string>();
  const { modifyLevel, editingLevel, setEditingLevel } = useLevelContext();

  if (!editingLevel) {
    return <Skeleton height="40px" variant="rectangular" />;
  }

  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      {editingName === undefined ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="1rem"
          width="100%"
        >
          <IconButton
            onClick={() => {
              navigateTo("levelEditor");
              setEditingLevel(null);
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography level="h1">{editingLevel.name}</Typography>
          <Tooltip title="Edit Name">
            <IconButton onClick={() => setEditingName(editingLevel.name)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" width="100%" gap="1rem">
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            sx={{ flex: 1 }}
          />
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
                modifyLevel({ level: { name: editingName }, saveToDb: true });
                setEditingName(undefined);
              }}
            >
              <Check />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      <div style={{ width: "2rem" }}></div>
      <Divider />
    </Stack>
  );
};

export const PlayingHeader: FC = () => {
  const { editingLevel, gameMode, setGameMode, levelIsDirty } =
    useLevelContext();
  const { setModal } = usePauseModalContext();
  const { navigateTo } = useNavigator();

  if (gameMode === "play") return null;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <IconButton
        onClick={() => {
          if (levelIsDirty) {
            setModal("save");
          } else {
            setGameMode("idle");
            navigateTo("editorDetail");
          }
        }}
      >
        <ArrowBack />
      </IconButton>

      {gameMode === "edit" && (
        <Typography level="h1">Editing {editingLevel?.name}</Typography>
      )}
      {gameMode === "test" && (
        <Typography level="h1">Testing {editingLevel?.name}</Typography>
      )}
      <div style={{ width: "2rem" }}></div>
    </Stack>
  );
};
