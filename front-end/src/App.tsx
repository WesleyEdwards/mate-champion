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
import { initializeDevSettings } from "./game/loopShared/devTools/devSettings";
import { initializeTextures } from "./gameAssets/textures";
import { AddableEntity } from "./components/GameEdit/CourseBuilderSettings";
import { Entity } from "./game/entities/entityTypes";

declare global {
  interface Window {
    stopLoop: boolean;
    pause: boolean;
    mateSettings: {
      showDevStats: boolean;
      collisionBoxesVisible: boolean;
      cameraLines: boolean;
    };
    editingEntities: Entity[];
    addingEntityType: AddableEntity;
    debounceLog: (...args: any[]) => void;
  }

  interface ObjectConstructor {
    entries<T extends object, K extends keyof T>(o: T): [K, T[K]][];
    keys<T extends object>(o: T): (keyof T)[];
  }
}

initializeDevSettings();
initializeTextures();

function debounceLog(...args: any[]) {
  const rand = Math.floor(0 + Math.random() * (10 + 1));
  if (rand === 1) console.log(...args);
}

window.debounceLog = debounceLog;
window.editingEntities = [];

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
