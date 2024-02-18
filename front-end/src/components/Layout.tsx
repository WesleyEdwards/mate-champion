import { Alert, Sheet, Stack } from "@mui/joy";
import { useLevelContext } from "../hooks/LevelsContext";
import { GameEntry, MCScreen } from "./GameEntry";
import { LevelCreator } from "./LevelCreator";
import { useState } from "react";

export const Layout = () => {
  const { editingLevel } = useLevelContext();

  const [screen, setScreen] = useState<MCScreen>("home");

  return (
    <>
      {editingLevel && (
        <Alert
          variant="soft"
          color="success"
          sx={{ width: "100%", borderRadius: 0, position: "fixed" }}
        >
          Editing <b>{editingLevel.name}</b>
        </Alert>
      )}
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <Stack direction="row">
          <Sheet variant="outlined" sx={{ m: 2, borderRadius: 10 }}>
            <GameEntry screen={screen} changeScreen={setScreen} />
          </Sheet>
          <LevelCreator changeScreen={setScreen} />
        </Stack>
      </Stack>
    </>
  );
};
