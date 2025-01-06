import {Logout} from "@mui/icons-material"
import {Button, Stack} from "@mui/joy"
import {useAuthContext} from "../hooks/useAuth"
import {EditField} from "./EditField"
import {SignInButton} from "./SignInButton"
import {ViewHeaderSubScreen} from "./ViewHeader"
import {MScreen} from "./Layout"
import { useNavigate } from "react-router-dom"

export const Profile = () => {
  const {user, logout, modifyUser, api} = useAuthContext()
  const navigate = useNavigate()

  return (
    <MScreen>
      <ViewHeaderSubScreen title="Profile" />
      <Stack gap="2rem" mb={2}>
        {user ? (
          <Stack gap="2rem">
            <EditField
              init={user.name ?? ""}
              label={"Name"}
              handleChange={(newName) => {
                modifyUser({name: newName})
                api.user.modify(user._id, {name: newName})
              }}
            />

            <EditField
              init={user.email ?? ""}
              label={"Email"}
              handleChange={(newEmail) => {
                modifyUser({email: newEmail})
                api.user.modify(user._id, {email: newEmail})
              }}
            />
            <Button
              onClick={() => {
                logout()
                navigate("/landing", {
                  flushSync: true
                })
              }}
              sx={{alignSelf: "center", mt: "2rem"}}
              endDecorator={<Logout />}
            >
              Log Out
            </Button>
          </Stack>
        ) : (
          <Stack my="2rem" gap="2rem">
            <SignInButton />
          </Stack>
        )}
      </Stack>
    </MScreen>
  )
}
