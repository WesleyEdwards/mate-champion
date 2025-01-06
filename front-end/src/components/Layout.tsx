import {CircularProgress, Sheet, Stack} from "@mui/joy"
import {routes} from "./Routes"
import {LevelCreator} from "./LevelCreator"
import {PauseModalProvider} from "../hooks/PauseModalContext"
import {RouterProvider} from "react-router-dom"
import {useAuthContext} from "../hooks/useAuth"

export const Layout = () => {
  const {loadingAuth} = useAuthContext()
  if (loadingAuth) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <PauseModalProvider>
      <RouterProvider router={routes} />
      {/* <LevelCreator /> */}
    </PauseModalProvider>
  )
}

export const MScreen = ({children}: {children: React.ReactNode}) => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Sheet variant="outlined" sx={{p: 2, m: 2, borderRadius: 10}}>
        <Stack mb={2} sx={{minWidth: "546px", maxWidth: "1300px"}}>
          {children}
        </Stack>
      </Sheet>
    </Stack>
  )
}
