import {createContext, useContext, useEffect, useRef, useState} from "react"
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

  const dirtyMap = useRef<LevelMap | null>(null)
  const [changeTrigger, setChangeTrigger] = useState(0)

  const [isDirty, setIsDirty] = useState<boolean>(false)

  const handleSetEditing: LevelsContextType["setEditingLevel"] = async (id) => {
    if (!api) return
    if (id === null) {
      setLevel(null)
      return Promise.resolve()
    }

    setLevel("loading")
    api.level.detail(id).then(setLevel)
  }

  const updateLevel = async () => {
    setIsDirty(false)
    if (!level || level === "loading" || !api) return
    const id = level._id
    const curr = await api.level.detail(id)
    if (objectsAreDifferent(curr, level)) {
      setLevel(curr)
    }
    const map = dirtyMap.current
    if (map) {
      const currMap = await api.level.levelMapDetail(id)
      const diff = getLevelDiff(currMap, map)
      await api.level.modifyMap(map._id, diff)
      dirtyMap.current = null
    }
  }

  useEffect(() => {
    if (!dirtyMap.current) return
    setIsDirty(true)
    const t = setTimeout(() => {
      updateLevel()
    }, 5_000)

    return () => {
      clearTimeout(t)
    }
  }, [changeTrigger])

  const updateLevelMap = async (m: Partial<LevelMap>) => {
    if (!api || !level) return
    if (level === "loading") return

    const d = dirtyMap.current ?? (await api.level.levelMapDetail(level._id))

    if (objectsAreDifferent(d, {...d, ...m})) {
      dirtyMap.current = {...d, ...m}
      setChangeTrigger(Date.now())
    }
  }

  return {
    editingLevel: level,
    updateLevelMap,
    saveIfDirty: updateLevel,
    setEditingLevel: handleSetEditing,
    isDirty
  } satisfies LevelsContextType
}

export type EditingLevel = LevelInfo | null | "loading"

export type LevelsContextType = {
  setEditingLevel: (editing: string | null) => void
  updateLevelMap: (m: Partial<LevelMap>) => void
  saveIfDirty: () => Promise<unknown>
  editingLevel: EditingLevel
  isDirty: boolean
}

export const LevelsContext = createContext({} as LevelsContextType)

export const useLevelContext = () => useContext(LevelsContext)
