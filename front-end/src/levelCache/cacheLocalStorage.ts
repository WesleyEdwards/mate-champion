import {CacheObj} from "../hooks/levelCache"

const emptyLevelCache: CacheObj = {
  public: undefined,
  owned: undefined,
  levelInfo: {},
  levelMaps: {}
}

export const levelCache = (): CacheObj => {
  const curr = localStorage.getItem("level-cache")
  if (!curr) {
    return {...emptyLevelCache}
  }
  return JSON.parse(curr) as CacheObj
}

const setCache = (cache: CacheObj) => {
  localStorage.setItem("level-cache", JSON.stringify(cache))
}

export const setLevelCache = (fun: (prev: CacheObj) => CacheObj) => {
  const curr = levelCache()
  setCache(fun(curr))
}
