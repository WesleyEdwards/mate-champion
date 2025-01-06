import {FC} from "react"
import {Button, Stack, Typography} from "@mui/joy"
import {useAuthContext} from "../hooks/useAuth"
import {ViewHeaderSubScreen} from "./ViewHeader"
import {useNavigate, useParams} from "react-router-dom"

export const PersonalHighScore = () => {
  const {user} = useAuthContext()
  const navigate = useNavigate()
  const {score: rawScore} = useParams<{score: string}>()
  const score = isNaN(parseInt(rawScore ?? "")) ? 0 : parseInt(rawScore ?? "")

  if (!user) {
    navigate(`/createAccount?score=${score}`)
  }

  return (
    <>
      <ViewHeaderSubScreen title="Personal High" />
      <Stack gap="2rem" sx={{width: "722px"}}>
        <Typography level="h2">
          You got a personal high score of {score}!
        </Typography>
        <Button
          style={{maxWidth: "12rem", alignSelf: "center"}}
          onClick={() => {
            navigate("/highScores")
          }}
        >
          View Scores
        </Button>
      </Stack>
    </>
  )
}
