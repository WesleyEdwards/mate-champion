import {Sheet, Stack} from "@mui/joy"
import {GameEntry, MCScreen} from "./GameEntry"
import {LevelCreator} from "./LevelCreator"
import {PauseModalProvider} from "../hooks/PauseModalContext"
import {useLevelContext} from "../hooks/useLevels"
import {NavigatorProvider} from "../hooks/UseNavigator"
import {useAuthContext} from "../hooks/useAuth"

export const Layout = () => {
  const {editingLevel} = useLevelContext()
  const {user} = useAuthContext()

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
          {editingLevel !== "loading" && // Visible if owner, or if not logged in And editing a level
            editingLevel &&
            (editingLevel?.owner === user?._id || !user) && <LevelCreator />}
        </Stack>
      </PauseModalProvider>
    </NavigatorProvider>
  )
}
