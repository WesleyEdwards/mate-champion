import {CircularProgress, Sheet, Stack} from "@mui/joy"
import {routes} from "./Routes"
import {PauseModalProvider} from "../hooks/PauseModalContext"
import {RouterProvider} from "react-router-dom"
import {AuthContext, useAuth} from "../hooks/useAuth"

export const AuthSwitch = () => {
  const authInfo = useAuth()

  if (authInfo.loadingAuth) {
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
      <AuthContext.Provider value={authInfo.authContext}>
        <RouterProvider router={routes} />
      </AuthContext.Provider>
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
