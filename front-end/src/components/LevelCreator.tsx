import { Button, Stack, Switch, Typography } from "@mui/joy";
import { Settings, devSettings, modifyDevSettings } from "../Game/devSettings";
import { CourseBuilderSettings } from "../Game/devTools/CourseBuilderSettings";
import { camelCaseToTitleCase } from "../helpers";
import { useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";

export const LevelCreator = () => {
  const { saveLevelToDb, editingLevel } = useAuthContext();
  const {pauseOpponent, ...displaySettings} = devSettings
  const [state, setState] = useState({ ...displaySettings });
  const [saving, setSaving] = useState(false);
  return (
    <Stack justifyContent="flex-end" m={2} gap={0.5}>
      {editingLevel && (
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
    </Stack>
  );
};
