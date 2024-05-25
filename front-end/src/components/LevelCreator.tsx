import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { Settings, devSettings, modifyDevSettings } from "../Game/devSettings";
import { CourseBuilderSettings } from "../Game/devTools/CourseBuilderSettings";
import { camelCaseToTitleCase } from "../helpers";
import { FC, useState } from "react";
import { MCScreen } from "./GameEntry";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { useLevelContext } from "../hooks/useLevels";

export const LevelCreator: FC<{ changeScreen: (screen: MCScreen) => void }> = ({
  changeScreen,
}) => {
  const { gameMode, editingLevel, setEditingLevel, setGameMode, modifyLevel } =
    useLevelContext();

  const { setModal } = usePauseModalContext();
  const [state, setState] = useState({ ...window.window.mateSettings });
  const [saving, setSaving] = useState(false);

  if (gameMode !== "edit") {
    return null;
  }

  return (
    <Stack m={2} gap={4} justifyContent="flex-start" height="748px">
      {gameMode === "edit" && editingLevel && (
        <Button
          loading={saving}
          sx={{
            alignSelf: "flex-start",
            width: "10rem",
          }}
          onClick={() => {
            setSaving(true);
            modifyLevel({ saveToDb: true }).then(() => setSaving(false));
          }}
        >
          Save
        </Button>
      )}

      <AccordionGroup>
        <Accordion>
          <AccordionSummary>Dev Settings</AccordionSummary>
          {Object.entries(state).map(([setting, enabled]) => (
            <AccordionDetails key={setting}>
              <Stack direction="row" justifyContent="space-between">
                <Typography key={setting} component="label">
                  {camelCaseToTitleCase(setting)}
                </Typography>

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
              </Stack>
            </AccordionDetails>
          ))}
        </Accordion>
      </AccordionGroup>

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
