import {Logout, Save, Undo} from "@mui/icons-material"
import {Button, IconButton, Input, Stack, Typography} from "@mui/joy"
import {FC} from "react"
import {PageStack, ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"
import {useAuthContext} from "../hooks/useAuth"
import {EditField} from "./EditField"
import {AlreadyHaveAccountButton, SignInButton} from "./SignInButton"

export const Profile: FC<ScreenProps> = () => {
  const {resetStack, navigateTo} = useNavigator()
  const {user, logout, modifyUser, api} = useAuthContext()

  return (
    <PageStack>
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
          <SignInButton />
          {/* <AlreadyHaveAccountButton /> */}
        </Stack>
      )}
    </PageStack>
  )
}
