import {
  CssBaseline,
  CssVarsProvider,
  Theme,
  ThemeProvider,
  extendTheme,
} from "@mui/joy";
import { mateTheme } from "./theme";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./hooks/AuthContext";
import { useLevels } from "./hooks/useLevels";
import { LevelsContext } from "./hooks/LevelsContext";
import { Layout } from "./components/Layout";

const theme: Theme = extendTheme(mateTheme);

function App() {
  const authInfo = useAuth();
  const levelManager = useLevels({ api: authInfo.api, user: authInfo.user });

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authInfo}>
          <LevelsContext.Provider value={levelManager}>
            <Layout />
          </LevelsContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App;
