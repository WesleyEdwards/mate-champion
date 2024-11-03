import {createContext, useContext, useEffect, useMemo, useState} from "react"
import {Api} from "../api/Api"
import {LoginBody, User} from "../types"
import {LocalStorageKeys, localStorageManager} from "../api/localStorageManager"
import {LiveApi} from "../api/LiveApi"
import {ApiCache} from "../api/ApiCache"
import {LocalApi, StoreItem} from "../api/LocalApi"
import {LevelInfo, LevelMap} from "../game/loopShared/models"

export type GameMode = "play" | "edit" | "test" | "idle"

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User>()
  const api: Api = useMemo(() => {
    const liveApi = new LiveApi(localStorageManager.get("token"))
    if (user === undefined) {
      return new LocalApi(liveApi)
    }
    const cache = new ApiCache(liveApi)
    return cache
  }, [user])

  useEffect(() => {
    if (localStorageManager.get("token")) {
      api.auth.getSelf().then(setUser)
    }
  }, [])

  const importLevels = async () => {
    if (
      localStorage.getItem("unauth-level-info") &&
      localStorage.getItem("unauth-level-map")
    ) {
      const levels = new StoreItem<LevelInfo>("unauth-level-info")
      const maps = new StoreItem<LevelMap>("unauth-level-map")
      console.log("Importing: ", {levels: levels.items, maps: maps.items})
      await api.level.importMap({levels: levels.items, maps: maps.items})
      localStorage.removeItem("unauth-level-info")
      localStorage.removeItem("unauth-level-map")
    }
  }

  const login = async (body: LoginBody) => {
    const authUser = await api.auth.signIn(body)
    localStorageManager.set("high-score", authUser.highScore)
    importLevels()
    setUser(authUser)
  }

  const createAccount = async (body: User & {password: string}) => {
    await api.auth.createAccount(body).then(setUser)
    importLevels()
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
    createAccount,
    logout,
    modifyUser
  }
}

type AuthContextType = {
  api: Api
  login: (body: LoginBody) => Promise<unknown>
  createAccount: (body: User & {password: string}) => Promise<unknown>
  user?: User
  logout: () => void
  modifyUser: (body: Partial<User>) => void
}

export const AuthContext = createContext({} as AuthContextType)

export const useAuthContext = () => useContext(AuthContext)
