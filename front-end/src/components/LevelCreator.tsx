import { Button, Stack, Switch, Typography } from "@mui/joy";
import { Settings, modifyDevSettings } from "../game/loopShared/devTools/devSettings";
import { camelCaseToTitleCase } from "../helpers";
import { FC, useState } from "react";
import { usePauseModalContext } from "../hooks/PauseModalContext";
import { useLevelContext } from "../hooks/useLevels";
import { CourseBuilderSettings } from "./CourseBuilderSettings";

export const LevelCreator: FC = () => {
  const { gameMode, editingLevel, levelCache } = useLevelContext();

  const { setModal } = usePauseModalContext();

  if (gameMode !== "edit") {
    return null;
  }

  return (
    <Stack m={2} justifyContent="flex-start" height="748px">
      <CourseBuilderSettings />
      <Button
        color="neutral"
        variant="plain"
        sx={{ marginTop: "auto" }}
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

// {/* {gameMode === "edit" && editingLevel && (
//         <Button
//           loading={saving}
//           sx={{
//             alignSelf: "flex-start",
//             width: "10rem",
//           }}
//           onClick={() => {
//             setSaving(true);
//             levelCache({ saveToDb: true }).then(() => setSaving(false));
//           }}
//         >
//           Save
//         </Button>
//       )} */}

//       {/* <AccordionGroup>
//         <Accordion>
//           <AccordionSummary>Dev Settings</AccordionSummary>
//           {Object.entries(state).map(([setting, enabled]) => (
//             <AccordionDetails key={setting}>
//               <Stack direction="row" justifyContent="space-between">
//                 <Typography key={setting} component="label">
//                   {camelCaseToTitleCase(setting)}
//                 </Typography>

//                 <Switch
//                   sx={{ ml: 1 }}
//                   checked={enabled}
//                   onChange={(e) => {
//                     if (
//                       "pointerType" in e.nativeEvent &&
//                       e.nativeEvent["pointerType"] === "mouse"
//                     ) {
//                       setState((prev) => ({
//                         ...prev,
//                         [setting]: e.target.checked,
//                       }));
//                       modifyDevSettings(
//                         setting as keyof Settings,
//                         e.target.checked
//                       );
//                     }
//                   }}
//                 />
//               </Stack>
//             </AccordionDetails>
//           ))}
//         </Accordion>
//       </AccordionGroup> */}
