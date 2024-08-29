import {createContext, useContext, useEffect, useMemo, useState} from "react"
import {FullLevelInfo, LevelInfo} from "../game/loopShared/models"
import {Api} from "../api/Api"
import {GameMode} from "./useAuth"
import {User} from "../types"
import {getLevelDiff, objectsAreDifferent} from "../helpers"
import {LevelCache, useLevelCache} from "./levelCache"

export const useLevels: (params: {
  api: Api | undefined
  user: User | undefined
}) => LevelsContextType = ({api, user}) => {
  const [level, setLevel] = useState<FullLevelInfo | null | "loading">(null)

  const [currGameMode, setCurrGameMode] = useState<GameMode>("idle")
  const [isDirty, setIsDirty] = useState(false)
  const levelCache = useLevelCache(api!, user!)

  const handleSetEditing: LevelsContextType["setEditingLevel"] = (newLevel) => {
    if (newLevel === null) {
      setLevel(null)
      return Promise.resolve()
    }

    setLevel("loading")
    levelCache.read.getFull(newLevel).then(setLevel)
  }

  const setGameMode = (mode: GameMode) => {
    if (mode === "idle") {
      window.stopLoop = true
    }
    setCurrGameMode(mode)
  }

  const updateLevel = async () => {
    if (!level || level === "loading") return
    const curr = await levelCache.read.getFull(level._id)
    if (currGameMode === "idle" && objectsAreDifferent(curr, level)) {
      setLevel(curr)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateLevel()
    }, 300)
    return () => clearInterval(interval)
  })

  return {
    editingLevel: level,
    gameMode: currGameMode,
    setGameMode,
    setEditingLevel: handleSetEditing,
    levelCache,
    isDirty,
    setIsDirty
  } satisfies LevelsContextType
}

export type LevelsContextType = {
  setEditingLevel: (editing: string | null) => void
  editingLevel: FullLevelInfo | "loading" | null
  gameMode: GameMode
  setGameMode: (show: GameMode) => void
  levelCache: LevelCache
  isDirty: boolean
  setIsDirty: (d: boolean) => void
}

export const LevelsContext = createContext({} as LevelsContextType)

export const useLevelContext = () => useContext(LevelsContext)
