import {
  Alert,
  CssBaseline,
  CssVarsProvider,
  Sheet,
  Stack,
  Theme,
  ThemeProvider,
  extendTheme,
  useColorScheme,
} from "@mui/joy";
import { GameEntry } from "./components/GameEntry";
import { mateTheme } from "./theme";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./hooks/AuthContext";
import { useEffect, useState } from "react";
import { LevelCreator } from "./components/LevelCreator";
import { useLevels } from "./hooks/useLevels";

const theme: Theme = extendTheme(mateTheme);

function App() {
  const authInfo = useAuth();
  const levelManager = useLevels({ api: authInfo.api });

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authInfo}>
          {levelManager.editingLevel && (
            <Alert
              variant="soft"
              color="success"
              sx={{ width: "100%", borderRadius: 0, position: "fixed" }}
            >
              Editing <b>{levelManager.editingLevel.name}</b>
            </Alert>
          )}
          <Stack alignItems="center" justifyContent="center" height="100vh">
            <Stack direction="row">
              <Sheet variant="outlined" sx={{ m: 2, borderRadius: 10 }}>
                <GameEntry />
              </Sheet>
              <LevelCreator />
            </Stack>
          </Stack>
        </AuthContext.Provider>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App;
