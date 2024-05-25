import { Alert, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { GameEntry, MCScreen } from "./GameEntry";
import { LevelCreator } from "./LevelCreator";
import { useState } from "react";
import { PauseModalProvider } from "../hooks/PauseModalContext";
import { Close } from "@mui/icons-material";
import { useLevelContext } from "../hooks/useLevels";

export const Layout = () => {
  const { editingLevel, setEditingLevel, gameMode } = useLevelContext();

  const [screen, setScreen] = useState<MCScreen>("home");

  return (
    <PauseModalProvider setScreen={setScreen}>
      {editingLevel && (
        <Alert
          variant="soft"
          color="success"
          size="lg"
          sx={{ width: "100%", borderRadius: 0, position: "fixed" }}
        >
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Typography>
              Editing <b>{editingLevel.name}</b>
            </Typography>
            <IconButton
              sx={{ borderRadius: "0.5rem" }}
              onClick={() => {
                setEditingLevel(null);
                setScreen("home");
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </Alert>
      )}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Sheet variant="outlined" sx={{ p: 2, m: 2, borderRadius: 10 }}>
          <GameEntry screen={screen} changeScreen={setScreen} />
        </Sheet>
        {gameMode === "edit" && <LevelCreator changeScreen={setScreen} />}
      </Stack>
    </PauseModalProvider>
  );
};
