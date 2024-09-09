import {Sheet, Stack} from "@mui/joy"
import {GameEntry, MCScreen} from "./GameEntry"
import {LevelCreator} from "./LevelCreator"
import {PauseModalProvider} from "../hooks/PauseModalContext"
import {useLevelContext} from "../hooks/useLevels"
import {NavigatorProvider} from "../hooks/UseNavigator"

export const Layout = () => {
  const {gameMode} = useLevelContext()

  return (
    <NavigatorProvider>
      <PauseModalProvider>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Sheet variant="outlined" sx={{p: 2, m: 2, borderRadius: 10}}>
            <GameEntry />
          </Sheet>
          {gameMode === "edit" && <LevelCreator />}
        </Stack>
      </PauseModalProvider>
    </NavigatorProvider>
  )
}
