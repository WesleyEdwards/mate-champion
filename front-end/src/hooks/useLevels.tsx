import {createContext, useContext, useEffect, useState} from "react"
import {LevelInfo, LevelMap} from "../game/loopShared/models"
import {Api} from "../api/Api"
import {GameMode} from "./useAuth"
import {User} from "../types"
import {getLevelDiff, objectsAreDifferent} from "../helpers"

export const useLevels: (params: {
  api: Api | undefined
  user: User | undefined
}) => LevelsContextType = ({api}) => {
  const [level, setLevel] = useState<EditingLevel>(null)
  const [map, setMap] = useState<LevelMap | null>(null)

  const [currGameMode, setCurrGameMode] = useState<GameMode>("idle")
  const [isDirty, setIsDirty] = useState(false)

  const handleSetEditing: LevelsContextType["setEditingLevel"] = async (id) => {
    if (!api) return
    if (id === null) {
      setLevel(null)
      return Promise.resolve()
    }

    setLevel("loading")
    api.level.detail(id).then(setLevel)
    api.level.levelMapDetail(id).then(setMap)
  }

  const setGameMode = (mode: GameMode) => {
    if (mode === "idle") {
      window.stopLoop = true
    }
    setCurrGameMode(mode)
  }

  const updateLevel = async () => {
    if (!level || level === "loading" || !api) return
    const id = level._id
    const curr = await api.level.detail(id)
    if (currGameMode === "idle" && objectsAreDifferent(curr, level)) {
      setLevel(curr)
    }
    if (!map) return
    const currMap = await api.level.levelMapDetail(id)
    if (objectsAreDifferent(currMap, map)) {
      const diff = getLevelDiff(currMap, map)
      api.level.modifyMap(map._id, diff).then((res) => {
        setMap(res)
      })
    }
  }

  useEffect(() => {
    console.log("IN use effect")
    const interval = setInterval(() => {
      updateLevel()
    }, 300)
    return () => clearInterval(interval)
  })

  const updateLevelMap = (m: Partial<LevelMap>) => {
    setMap((prev) => (prev ? {...prev, ...m} : null))
  }

  return {
    editingLevel: level,
    gameMode: currGameMode,
    setGameMode,
    updateLevelMap,
    setEditingLevel: handleSetEditing,
    isDirty,
    setIsDirty
  } satisfies LevelsContextType
}

export type EditingLevel = LevelInfo | null | "loading"

export type LevelsContextType = {
  setEditingLevel: (editing: string | null) => void
  updateLevelMap: (m: Partial<LevelMap>) => void
  editingLevel: EditingLevel
  gameMode: GameMode
  setGameMode: (show: GameMode) => void
  isDirty: boolean
  setIsDirty: (d: boolean) => void
}

export const LevelsContext = createContext({} as LevelsContextType)

export const useLevelContext = () => useContext(LevelsContext)
