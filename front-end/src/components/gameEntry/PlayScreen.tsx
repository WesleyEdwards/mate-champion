import {Button} from "@mui/joy"
import {FC, useEffect} from "react"
import {useAuthContext} from "../../hooks/useAuth"
import {emptyStats} from "../../game/loopShared/utils"
import {localStorageManager} from "../../api/localStorageManager"
import levelsInfo from "../../levels.json"
import {usePauseModalContext} from "../../hooks/PauseModalContext"
import {playLoop} from "../../game/play/playLoop"
import {LevelMap} from "../../api/serverModels"
import {useNavigate} from "react-router-dom"
import {PlayHeader} from "../ViewHeader"
import StatsDiv from "../StatsDiv"
import {MScreen} from "../AuthSwitch"

export const PlayScreen = () => {
  const {setModal, stats, modifyStats} = usePauseModalContext()
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
        handleLose,
        handlePause: (pause) => setModal(pause ? "pause" : null)
      },
      levels: levelsInfo as unknown as LevelMap[]
    })
  }, [])

  return (
    <MScreen>
      <PlayHeader />
      <canvas style={{borderRadius: "10px"}} id="canvas"></canvas>
      <StatsDiv stats={stats} />
    </MScreen>
  )
}
