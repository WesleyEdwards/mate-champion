import {createContext, useContext, useEffect, useMemo, useState} from "react"
import {Api} from "../api/Api"
import {LoginBody, User} from "../api/types"
import {localStorageManager} from "../api/localStorageManager"
import {LiveApi} from "../api/LiveApi"
import {ApiCache} from "../api/ApiCache"
import {LocalApi, StoreItem} from "../api/LocalApi"
import {LevelInfo, LevelMap} from "../api/serverModels"

export type GameMode = "play" | "edit" | "test" | "idle"

export const useAuth = (): AuthContextType => {
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
      console.log("Token", token)
      if (token) {
        try {
          const u = await api.auth.getSelf()
          // console.log("user is", u)
          setUser(u)
          console.log("set laoding to false")
          setLoadingAuth(false)
        } catch {
          // setLoadingAuth(false)
        }
      } else {
        // setLoadingAuth(false)
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
      console.log("Importing: ", {levels: levels.items, maps: maps.items})
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
    localStorageManager.set("high-score", res.user.highScore)
    localStorageManager.set("token", res.token)

    importLevels(new LiveApi(res.token))
    setUser(res.user)
  }

  const logout = () => {
    localStorageManager.remove("token")
    setUser(undefined)
  }

  const modifyUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? {...prev, ...partial} : prev))
  }

  return {
    api,
    user,
    login,
    loadingAuth,
    logout,
    modifyUser
  }
}

type AuthContextType = {
  api: Api
  login: (body: LoginBody) => Promise<unknown>
  loadingAuth: boolean
  user?: User
  logout: () => void
  modifyUser: (body: Partial<User>) => void
}

export const AuthContext = createContext({} as AuthContextType)

export const useAuthContext = () => useContext(AuthContext)
