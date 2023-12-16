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

function App() {
  const theme: Theme = extendTheme(mateTheme);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Stack alignItems="center" justifyContent="center" height="100vh">
          <Sheet variant="outlined" sx={{ m: 2, borderRadius: 10 }}>
            <GameEntry />
          </Sheet>
        </Stack>
      </ThemeProvider>
    </CssVarsProvider>
  );
}

export default App;
