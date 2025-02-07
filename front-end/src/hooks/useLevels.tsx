import {useEffect, useRef, useState} from "react"
import {getLevelDiff, objectsAreDifferent} from "../helpers"
import {useAuthContext} from "./useAuth"
import {LevelInfo, LevelMap} from "../api/types"

export const useLevels: (params: {
  level: LevelInfo | null
  setLevel: React.Dispatch<React.SetStateAction<LevelInfo | null>>
}) => LevelsContextType = ({level, setLevel}) => {
  const {api} = useAuthContext()

  const dirtyMap = useRef<LevelMap | null>(null)
  const [changeTrigger, setChangeTrigger] = useState(0)

  const [isDirty, setIsDirty] = useState<boolean>(false)

  const updateLevel = async () => {
    if (!level) return
    setIsDirty(false)
    const map = dirtyMap.current
    if (map) {
      const currMap = await api.level.levelMapDetail(level._id)
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

    const d = dirtyMap.current ?? (await api.level.levelMapDetail(level._id))

    if (objectsAreDifferent(d, {...d, ...m})) {
      dirtyMap.current = {...d, ...m}
      setChangeTrigger(Date.now())
    }
  }

  return {
    updateLevelMap,
    saveIfDirty: updateLevel,
    isDirty
  }
}

export type LevelsContextType = {
  updateLevelMap: (m: Partial<LevelMap>) => void
  saveIfDirty: () => Promise<unknown>
  isDirty: boolean
}
