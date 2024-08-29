import {Alert, IconButton, Sheet, Stack, Typography} from "@mui/joy"
import {GameEntry, MCScreen} from "./GameEntry"
import {LevelCreator} from "./LevelCreator"
import {createContext, useContext, useState} from "react"
import {PauseModalProvider} from "../hooks/PauseModalContext"
import {Close} from "@mui/icons-material"
import {useLevelContext} from "../hooks/useLevels"
import {NavigatorProvider, useNavigator} from "../hooks/UseNavigator"
import {EditLevelTopBar} from "./EditLevelTopBar"

export const Layout = () => {
  const {gameMode} = useLevelContext()

  return (
    <NavigatorProvider>
      <PauseModalProvider>
        <EditLevelTopBar />
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
