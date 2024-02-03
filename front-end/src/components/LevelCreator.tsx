import { Stack, Switch, Typography } from "@mui/joy";
import { Settings, devSettings, modifyDevSettings } from "../Game/devSettings";
import { CourseBuilderSettings } from "../Game/devTools/CourseBuilderSettings";
import { camelCaseToTitleCase } from "../helpers";
import { useState } from "react";

export const LevelCreator = () => {
  const [state, setState] = useState({ ...devSettings });
  return (
    <Stack justifyContent="flex-end" m={2} gap={2}>
      {Object.entries(state).map(([setting, enabled]) => (
        <Typography
          component="label"
          startDecorator={
            <Switch
              key={setting}
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
