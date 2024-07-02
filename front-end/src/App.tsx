import {
  CssBaseline,
  CssVarsProvider,
  Theme,
  ThemeProvider,
  extendTheme,
} from "@mui/joy";
import { mateTheme } from "./theme";
import { AuthContext, useAuth } from "./hooks/useAuth";
import { LevelsContext, useLevels } from "./hooks/useLevels";
import { Layout } from "./components/Layout";
import { ItemType } from "./Game/devTools/CreatingThing";
import { initializeDevSettings } from "./Game/devSettings";

declare global {
  interface Window {
    stopLoop: boolean;
    pause: boolean
    mateSettings: {
      showDevStats: boolean;
      collisionBoxesVisible: boolean;
      cameraLines: boolean;
      invincibility: boolean;
    };
    selectedItem: ItemType;
  }

  interface ObjectConstructor {
    entries<T extends object, K extends keyof T>(o: T): [K, T[K]][];
    keys<T extends object>(o: T): (keyof T)[];
  }
}

initializeDevSettings();

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
