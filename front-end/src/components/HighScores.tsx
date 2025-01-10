import {useEffect, useState} from "react"
import {ScoreListItem} from "./ScoreListItem"
import {
  Alert,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from "@mui/joy"
import {TopScore} from "../api/types"
import {useAuthContext} from "../hooks/useAuth"
import {localStorageManager} from "../api/localStorageManager"
import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import {MScreen} from "./AuthSwitch"
import mateMan from "../assets/champ/mate-single.png"
import {ViewHeaderSubScreen} from "./ViewHeader"
import {MCModal} from "./MCModal"
import {SignInButton} from "./SignInButton"

export const HighScores = () => {
  const [highScores, setHighScores] = useState<TopScore[]>()
  const [error, setError] = useState<string>()
  const {api, user} = useAuthContext()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const myScore = localStorageManager.get("high-score")
  useEffect(() => {
    api.score
      .topScores()
      .then(setHighScores)
      .catch(() => setError("Unable to load high scores"))
  }, [])

  return (
    <>
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
          {!user && highScores?.some((s) => s.score < myScore) && (
            <Alert
              endDecorator={
                <Button size="sm" variant="outlined" onClick={() => navigate("/login")}>Sign In</Button>
              }
              sx={{maxWidth: "28rem", alignSelf: "center"}}
            >
              Create an account or log in so you show up on the leaderboard!
            </Alert>
          )}
          {error && (
            <Alert color="danger" sx={{maxWidth: "22rem", alignSelf: "center"}}>
              {error}
            </Alert>
          )}
          {!!myScore && (
            <>
              <Divider />
              <Stack direction="row" justifyContent="center">
                <Typography level="h4">My Score: {myScore}</Typography>
              </Stack>
            </>
          )}
        </PageStack>
      </MScreen>
      <MCModal
        title={""}
        open={!!params.get("personal-high")}
        onClose={() => {
          setParams("", {replace: true})
        }}
        hideActions
        onConfirm={() => {}}
      >
        <Typography
          level="h2"
          textAlign={"center"}
          sx={{mb: "1rem", whiteSpace: "nowrap"}}
        >
          You got a personal high score of <b>{myScore}</b> 🎉
        </Typography>
        <img src={mateMan} style={{width: "64px", alignSelf: "center"}} />
      </MCModal>
    </>
  )
}

export const PageStack = ({children}: {children: React.ReactNode}) => {
  return (
    <Stack gap="2rem" mb={2}>
      {children}
    </Stack>
  )
}
