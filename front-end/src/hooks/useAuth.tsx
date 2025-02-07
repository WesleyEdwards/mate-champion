import {createContext, useContext, useEffect, useMemo, useState} from "react"
import {Api} from "../api/Api"
import {LevelInfo, LevelMap, LoginBody, User} from "../api/types"
import {localStorageManager} from "../api/localStorageManager"
import {LiveApi} from "../api/LiveApi"
import {ApiCache} from "../api/ApiCache"
import {LocalApi, StoreItem} from "../api/LocalApi"

export const useAuth = ():
  | {loadingAuth: true}
  | {loadingAuth: false; authContext: AuthContextType} => {
  const [user, setUser] = useState<User>()
  const [loadingAuth, setLoadingAuth] = useState(true)

  const api: Api = useMemo(() => {
    const liveApi = new LiveApi(localStorageManager.get("token"))
    if (user === undefined) {
      return new LocalApi(liveApi)
    }
    const cache = new ApiCache(liveApi)
    return cache
  }, [user])

  useEffect(() => {
    ;(async () => {
      const token = localStorageManager.get("token")
      if (token) {
        try {
          const u = await api.auth.getSelf()
          setUser(u)
          setLoadingAuth(false)
        } catch {
          setLoadingAuth(false)
        }
      } else {
        setLoadingAuth(false)
      }
    })()
  }, [])

  const importLevels = async (liveApi: Api) => {
    if (
      localStorage.getItem("unauth-level-info") &&
      localStorage.getItem("unauth-level-map")
    ) {
      const levels = new StoreItem<LevelInfo>("unauth-level-info")
      const maps = new StoreItem<LevelMap>("unauth-level-map")
      console.info("Importing: ", {levels: levels.items, maps: maps.items})
      await liveApi.level.importMap({
        toImport: levels.items.map((level) => ({
          level: level,
          map: maps.items.find((m) => m._id === level._id)!
        }))
      })
      localStorage.removeItem("unauth-level-info")
      localStorage.removeItem("unauth-level-map")
    }
  }

  const login = async (body: LoginBody) => {
    const res = await api.auth.submitAuthCode(body)
    const newApi = new LiveApi(res.token)
    const myScore = +localStorageManager.get("high-score")
    if (myScore && res.user) {
      await newApi.score.create({
        _id: crypto.randomUUID(),
        score: myScore,
        userId: res.user._id
      })
      localStorageManager.remove("high-score")
    }
    localStorageManager.set("token", res.token)

    importLevels(new LiveApi(res.token))
    setUser({...res.user, highScore: Math.max(res.user.highScore, myScore)})
  }

  const logout = () => {
    localStorageManager.remove("token")
    setUser(undefined)
  }

  const modifyUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? {...prev, ...partial} : prev))
  }

  if (loadingAuth) {
    return {loadingAuth: true}
  }

  return {
    authContext: {
      api,
      user,
      login,
      logout,
      modifyUser
    },
    loadingAuth: false
  }
}

type AuthContextType = {
  api: Api
  login: (body: LoginBody) => Promise<unknown>
  user?: User
  logout: () => void
  modifyUser: (body: Partial<User>) => void
}

export const AuthContext = createContext({} as AuthContextType)

export const useAuthContext = () => useContext(AuthContext)
