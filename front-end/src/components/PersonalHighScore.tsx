import {FC} from "react"
import {CreateAccount} from "./CreateAccount"
import {Button, Stack, Typography} from "@mui/joy"
import {useAuthContext} from "../hooks/useAuth"
import {MCScreen, ScreenProps} from "./GameEntry"
import {useNavigator} from "../hooks/UseNavigator"

export const PersonalHighScore: FC<ScreenProps> = ({score, modifyStats}) => {
  const {user} = useAuthContext()
  const {navigateTo} = useNavigator()

  if (user) {
    return (
      <Stack gap="2rem" sx={{width: "722px"}}>
        <Typography level="h2">
          You got a personal high score of {score}!
        </Typography>
        <Button
          style={{maxWidth: "12rem", alignSelf: "center"}}
          onClick={() => {
            navigateTo("highScores")
          }}
        >
          View Scores
        </Button>
      </Stack>
    )
  }

  return <CreateAccount score={score} modifyStats={modifyStats} />
}
