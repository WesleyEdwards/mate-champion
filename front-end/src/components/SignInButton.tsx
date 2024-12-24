import {Button} from "@mui/joy"
import {useNavigator} from "../hooks/UseNavigator"
import {LoginRounded} from "@mui/icons-material"

export const SignInButton = () => {
  const {navigateTo} = useNavigator()
  return (
    <Button
      size="lg"
      endDecorator={<LoginRounded />}
      onClick={() => {
        navigateTo("login")
      }}
      sx={{alignSelf: "center", minWidth: "12rem"}}
    >
      Sign In
    </Button>
  )
}
