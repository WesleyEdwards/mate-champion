import {useEffect, useState} from "react"
import {ScoreListItem} from "./ScoreListItem"
import {Alert, Divider, IconButton, Skeleton, Stack, Typography} from "@mui/joy"
import {TopScore} from "../api/types"
import {useAuthContext} from "../hooks/useAuth"
import {localStorageManager} from "../api/localStorageManager"
import {useParams} from "react-router-dom"
import {MScreen} from "./Layout"
import {ArrowBack} from "@mui/icons-material"
import {ViewHeaderSubScreen} from "./ViewHeader"

export const HighScores = () => {
  const [highScores, setHighScores] = useState<TopScore[]>()
  const [error, setError] = useState<string>()
  const {api, user} = useAuthContext()
  const {score} = useParams<{score: string}>()

  useEffect(() => {
    api.score
      .topScores()
      .then(setHighScores)
      .catch(() => setError("Unable to load high scores"))
  }, [])

  return (
    <MScreen>
      <ViewHeaderSubScreen title="High Scores" />
      <PageStack>
        <Stack alignSelf="center">
          {!highScores &&
            !error &&
            Array.from({length: 15}).map((_, i) => (
              <Skeleton
                variant="rectangular"
                key={i}
                sx={{mb: "0.5rem"}}
                width="20rem"
                height="1rem"
              />
            ))}
          {highScores?.map((info, i) => (
            <ScoreListItem num={i + 1} score={info} key={i} />
          ))}
        </Stack>
        {!user &&
          highScores?.some(
            (s) => s.score < localStorageManager.get("high-score")
          ) && (
            <Alert sx={{maxWidth: "22rem", alignSelf: "center"}}>
              Create an account or log in so you show up on the leaderboard!
            </Alert>
          )}
        {error && (
          <Alert color="danger" sx={{maxWidth: "22rem", alignSelf: "center"}}>
            {error}
          </Alert>
        )}
        {!!score && (
          <>
            <Divider />
            <Stack direction="row" justifyContent="center">
              <Typography level="h4">Your Score: {score}</Typography>
            </Stack>
          </>
        )}
      </PageStack>
    </MScreen>
  )
}

export const PageStack = ({children}: {children: React.ReactNode}) => {
  return (
    <Stack gap="2rem" mb={2}>
      {children}
    </Stack>
  )
}
