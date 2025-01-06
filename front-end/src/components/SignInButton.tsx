import {Button} from "@mui/joy"
import {LoginRounded} from "@mui/icons-material"
import {useNavigate} from "react-router-dom"

export const SignInButton = () => {
  const navigate = useNavigate()
  return (
    <Button
      size="lg"
      endDecorator={<LoginRounded />}
      onClick={() => {
        navigate("/login")
      }}
      sx={{alignSelf: "center", minWidth: "12rem"}}
    >
      Sign In
    </Button>
  )
}
