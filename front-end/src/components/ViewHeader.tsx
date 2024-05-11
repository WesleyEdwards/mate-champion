import {
  Divider,
  IconButton,
  Input,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { MCScreen } from "./GameEntry";
import { ArrowBack, Check, Edit, Undo } from "@mui/icons-material";
import { FC, useState } from "react";
import { useLevelContext } from "../hooks/LevelsContext";

export const ViewHeaderSubScreen: FC<{
  changeScreen: (screen: MCScreen) => void;
  title: string;
}> = ({ changeScreen, title }) => {
  return (
    <Stack width="100%" gap="0.75rem" mb="1rem">
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => changeScreen("home")}>
          <ArrowBack />
        </IconButton>
        <Typography level="h2">{title}</Typography>
        <div style={{ width: "2rem" }}></div>
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

export const EditLevelDetailHeader: FC<{
  changeScreen: (screen: MCScreen) => void;
}> = ({ changeScreen }) => {
  const [editingName, setEditingName] = useState<string>();
  const { modifyLevel, editingLevel, setGameMode, saveLevelToDb } =
    useLevelContext();

  if (!editingLevel) return null;
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
          <IconButton onClick={() => changeScreen("levelEditor")}>
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
                saveLevelToDb({ name: editingName });
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
