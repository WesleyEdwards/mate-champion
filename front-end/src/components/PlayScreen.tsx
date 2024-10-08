import {Button} from "@mui/joy"
import {FC} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {emptyStats} from "../game/loopShared/utils"
import {localStorageManager} from "../api/localStorageManager"
import {MCScreen} from "./GameEntry"
import levelsInfo from "../levels.json"
import {usePauseModalContext} from "../hooks/PauseModalContext"
import {useLevelContext} from "../hooks/useLevels"
import {playLoop} from "../game/play/playLoop"
import {LevelMap, PlayStats} from "../game/loopShared/models"

export const PlayScreen: FC<{
  modifyStats: (newStats: Partial<PlayStats>) => void
  screen: MCScreen
  setScreen: (screen: MCScreen) => void
}> = ({modifyStats, setScreen, screen}) => {
  const {user, api, modifyUser} = useAuthContext()
  const {setGameMode} = useLevelContext()

  const {setModal} = usePauseModalContext()

  const handleLose = (score: number) => {
    const personalHigh =
      user?.highScore ?? parseInt(localStorageManager.get("high-score") ?? "0")
    const isPersonalHigh = score > personalHigh
    if (isPersonalHigh) {
      localStorageManager.set("high-score", score.toString())
      if (user) {
        api.score.create({
          _id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score: score,
          userId: user._id
        })
        modifyUser({highScore: score})
        modifyStats({score})
      }
      return setScreen("personalHigh")
    }
    return setScreen("highScores")
  }

  if (screen !== "home") return null

  return (
    <Button
      sx={{width: "11rem", mb: "2rem"}}
      onClick={() => {
        modifyStats({...emptyStats})
        setScreen("game")

        setGameMode("play")

        window.stopLoop = false
        playLoop({
          setUI: {
            modifyStats,
            handleLose,
            handlePause: (pause) => setModal(pause ? "pause" : null)
          },
          levels: levelsInfo as unknown as LevelMap[]
        })
      }}
    >
      Play
    </Button>
  )
}
