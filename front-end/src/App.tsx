import {
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

const theme: Theme = extendTheme(mateTheme);

function App() {
  const authInfo = useAuth();

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authInfo}>
          <Stack alignItems="center" justifyContent="center" height="100vh">
            <Stack direction="row">
              <LevelCreator />
              <Sheet variant="outlined" sx={{ m: 2, borderRadius: 10 }}>
                <GameEntry />
              </Sheet>
            </Stack>
          </Stack>
        </AuthContext.Provider>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App;
