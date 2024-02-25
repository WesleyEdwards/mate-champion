import { Button, Stack, Switch, Typography } from "@mui/joy";
import { Settings, devSettings, modifyDevSettings } from "../Game/devSettings";
import { CourseBuilderSettings } from "../Game/devTools/CourseBuilderSettings";
import { camelCaseToTitleCase } from "../helpers";
import { FC, useState } from "react";
import { useLevelContext } from "../hooks/LevelsContext";
import { MCScreen } from "./GameEntry";
import { usePauseModalContext } from "../hooks/PauseModalContext";

export const LevelCreator: FC<{ changeScreen: (screen: MCScreen) => void }> = ({
  changeScreen,
}) => {
  const {
    saveLevelToDb,
    gameMode,
    editingLevel,
    setEditingLevel,
    setGameMode,
  } = useLevelContext();

  const { setModal } = usePauseModalContext();
  const [state, setState] = useState({ ...window.window.mateSettings });
  const [saving, setSaving] = useState(false);

  if ((gameMode === "idle" && !editingLevel) || gameMode === "play") {
    return null;
  }

  return (
    <Stack justifyContent="flex-end" m={2} gap={1}>
      <Button
        color="neutral"
        onClick={() => {
          if (gameMode === "edit") {
            setModal("save");
          } else {
            window.stopLoop = true;
            setEditingLevel(null);
            setGameMode("idle");
            changeScreen("home");
          }
        }}
      >
        Exit level creator
      </Button>
      {gameMode === "edit" && editingLevel && (
        <Button
          loading={saving}
          onClick={() => {
            setSaving(true);
            saveLevelToDb().then(() => setSaving(false));
          }}
        >
          Save
        </Button>
      )}

      {Object.entries(state).map(([setting, enabled]) => (
        <Typography
          key={setting}
          component="label"
          startDecorator={
            <Switch
              sx={{ ml: 1 }}
              checked={enabled}
              onChange={(e) => {
                if (
                  "pointerType" in e.nativeEvent &&
                  e.nativeEvent["pointerType"] === "mouse"
                ) {
                  setState((prev) => ({
                    ...prev,
                    [setting]: e.target.checked,
                  }));
                  modifyDevSettings(
                    setting as keyof Settings,
                    e.target.checked
                  );
                }
              }}
            />
          }
        >
          {camelCaseToTitleCase(setting)}
        </Typography>
      ))}
      <CourseBuilderSettings />
      <Button
        color="neutral"
        variant="plain"
        onClick={(e) => {
          if (
            "pointerType" in e.nativeEvent &&
            e.nativeEvent["pointerType"] === "mouse"
          ) {
            setModal("help");
          }
        }}
        endDecorator="?"
      >
        Help
      </Button>
    </Stack>
  );
};
