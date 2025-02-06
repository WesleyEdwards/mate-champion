import {Typography} from "@mui/joy"
import {FC, useEffect, useMemo, useState} from "react"
import {useAuthContext} from "../hooks/useAuth"
import {localStorageManager} from "../api/localStorageManager"

export const PersonalHigh: FC = () => {
  const {user} = useAuthContext()
  const [high, setHigh] = useState(0)

  const highScore = useMemo(() => {
    if (user?.highScore) {
      return user.highScore
    }
    if (localStorageManager.get("high-score")) {
      return parseInt(localStorageManager.get("high-score") ?? "0")
    }
  }, [])
  if (highScore) {
    return (
      <Typography level="h4" sx={{mt: "2rem"}}>
        Personal High Score: {highScore}
      </Typography>
    )
  }
  return null
}
