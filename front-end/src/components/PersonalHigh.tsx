import {Button, Typography} from "@mui/joy"
import {FC} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {localStorageManager} from "../api/localStorageManager"
import {useAuth} from "../hooks/useAuth"

export const PersonalHigh: FC = () => {
  const {user} = useAuthContext()
  const highScore = (() => {
    if (localStorageManager.get("high-score")) {
      return parseInt(localStorageManager.get("high-score") ?? "0")
    }
    if (user?.highScore) {
      localStorageManager.set("high-score", user.highScore.toString())
      return user?.highScore
    }
  })()
  if (highScore) {
    return (
      <Typography level="h4" sx={{mt: "2rem"}}>
        Personal High Score: {highScore}
      </Typography>
    )
  }
  return null
}
