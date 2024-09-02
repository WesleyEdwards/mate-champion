import {Logout, Save, Undo} from "@mui/icons-material"
import {Button, IconButton, Input, Stack, Typography} from "@mui/joy"
import {FC} from "react"
import {ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"
import {useAuthContext} from "../hooks/useAuth"
import {EditField} from "./EditField"

export const Profile: FC<ScreenProps> = () => {
  const {resetStack, navigateTo} = useNavigator()
  const {user, logout, modifyUser, api} = useAuthContext()

  return (
    <Stack gap="1rem" mb={2} sx={{width: "722px"}}>
      {user ? (
        <Stack gap="3rem">
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
              resetStack()
            }}
            sx={{alignSelf: "center", mt: "2rem"}}
            endDecorator={<Logout />}
          >
            Log Out
          </Button>
        </Stack>
      ) : (
        <Stack my="2rem" gap="2rem">
          <Button
            sx={{alignSelf: "center"}}
            onClick={() => navigateTo("createAccount")}
          >
            Create Account
          </Button>
          <Button
            sx={{alignSelf: "center"}}
            variant="plain"
            onClick={() => navigateTo("login")}
          >
            Already have an account?
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
