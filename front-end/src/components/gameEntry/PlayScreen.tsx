import {Stack, Typography} from "@mui/joy"
import {useEffect} from "react"
import {useAuthContext} from "../../hooks/useAuth"
import {emptyStats} from "../../game/loopShared/utils"
import {localStorageManager} from "../../api/localStorageManager"
import levelsInfo from "../../levels.json"
import {usePauseModalContext} from "../../hooks/PauseModalContext"
import {playLoop} from "../../game/play/playLoop"
import {useNavigate} from "react-router-dom"
import StatsDiv from "../StatsDiv"
import {MScreen} from "../AuthSwitch"
import {LevelMap} from "../../api/types"
import {BackButton} from "../ViewHeader"
import {abortGame} from "../../game/editor/eventListeners"

export const PlayScreen = () => {
  const {stats, modifyStats} = usePauseModalContext()
  const navigate = useNavigate()
  const {user, api, modifyUser} = useAuthContext()

  const handleLose = (score: number) => {
    const personalHigh =
      user?.highScore ?? parseInt(localStorageManager.get("high-score") ?? "0")
    const isPersonalHigh = score > personalHigh
    if (isPersonalHigh) {
      localStorageManager.set("high-score", score.toString())
      if (user) {
        api.score.create({
          _id: crypto.randomUUID(),
          score: score,
          userId: user._id
        })
        modifyUser({highScore: score})
        modifyStats({score})
      }
      return navigate(`/highScores?personal-high=true`, {replace: true})
    }
    return navigate("/highScores", {replace: true})
  }

  useEffect(() => {
    modifyStats({...emptyStats})
    playLoop({
      setUI: {
        modifyStats,
        handleLose
      },
      levels: levelsInfo as unknown as LevelMap[]
    })
    return () => {
      abortGame()
    }
  }, [])

  return (
    <MScreen>
      <Stack direction={"row"} height="64px" alignItems={"center"}>
        <BackButton />
        <Typography
          sx={{
            marginInline: "auto"
          }}
          level="h1"
        >
          Mate Champion🧉
        </Typography>
      </Stack>
      <canvas style={{borderRadius: "10px"}} id="canvas"></canvas>
      <StatsDiv stats={stats} />
    </MScreen>
  )
}
