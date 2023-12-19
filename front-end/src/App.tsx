import {
  CssBaseline,
  CssVarsProvider,
  Sheet,
  Stack,
  Theme,
  ThemeProvider,
  extendTheme,
} from "@mui/joy";
import { GameEntry } from "./components/GameEntry";
import { mateTheme } from "./theme";
import { useScoreData } from "./hooks/useScoreInfo";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./hooks/AuthContext";

function App() {
  const theme: Theme = extendTheme(mateTheme);

  const { api, user } = useAuth();

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={{ api, user }}>
          <Stack alignItems="center" justifyContent="center" height="100vh">
            <Sheet variant="outlined" sx={{ m: 2, borderRadius: 10 }}>
              <GameEntry />
            </Sheet>
          </Stack>
        </AuthContext.Provider>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App;
