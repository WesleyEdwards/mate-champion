import {LevelInfo, LevelMap} from "../game/loopShared/models"
import {User, LoginBody, Condition, Score, TopScore} from "../types"
import {Api} from "./Api"
import {localStorageManager} from "./localStorageManager"

type Method = "get" | "post" | "put" | "delete"

export class LiveApi implements Api {
  private token: string
  public baseUrl = import.meta.env.VITE_BACKEND_URL
  type = "server" as const

  public constructor(token: string | null) {
    this.token = token || ""
  }

  private setToken(token: string) {
    if (!token) return
    this.token = token
    localStorageManager.set("token", token)
  }

  private get(path: string) {
    return makeRequest(path, "get", this.token, this.baseUrl)
  }

  private post(path: string, body: Record<string, any>) {
    return makeRequest(path, "post", this.token, this.baseUrl, body)
  }

  private put(path: string, body: Record<string, any>) {
    return makeRequest(path, "put", this.token, this.baseUrl, body)
  }

  private del(path: string) {
    return makeRequest(path, "delete", this.token, this.baseUrl)
  }

  readonly auth = {
    createAccount: (
      body: User & {password: string; score?: number}
    ): Promise<User> => {
      return this.post("user/create", body).then((res) => {
        this.setToken(res.token)
        return res.user
      })
    },
    signIn: (body: LoginBody): Promise<User> => {
      return this.post("user/login", body).then((res) => {
        this.setToken(res.token)
        return res.user
      })
    },
    getSelf: (): Promise<User> => {
      if (!this.token) return Promise.reject("No token")
      return this.get("user")
    }
  }

  readonly user = {
    detail: (id: string): Promise<User> => {
      return this.get(`user/${id}`)
    },
    query: (filter: Condition<User>): Promise<User[]> => {
      return this.post("user", filter)
    },
    create: (body: User): Promise<User> => {
      return this.post("user/create", body)
    },
    modify: (id: string, mod: Partial<User>): Promise<User> => {
      return this.put(`user/${id}`, mod)
    },
    delete: (id: string): Promise<User> => {
      return this.del(`user/${id}`)
    }
  }

  readonly level: Api["level"] = {
    detail: (id: string): Promise<LevelInfo> => {
      return this.get(`level/${id}`)
    },
    query: (filter: Condition<LevelInfo>): Promise<LevelInfo[]> => {
      return this.post("level/query", filter)
    },
    create: (body) => this.post("level/insert", body),
    modify: (id, mod) => this.put(`level/${id}`, mod),
    delete: (id) => this.del(`level/${id}`),
    generate: (ids) => this.post(`level/generate`, ids),
    levelMapDetail: (id) => this.get(`level-map/${id}`),
    modifyMap: (id, mod) => this.put(`level-map/${id}`, mod),
    importMap: (info) => this.post("level/import-map", info)
  }
  readonly score = {
    detail: (id: string): Promise<Score> => {
      return this.get(`score/${id}`)
    },
    query: (filter: Condition<Score>): Promise<Score[]> => {
      return this.post("score/query", filter)
    },
    create: (body: Score): Promise<Score> => {
      return this.post("score/create", body)
    },
    update: (id: string, body: Partial<Score>): Promise<Score> => {
      return this.put(`score/${id}`, body)
    },
    delete: (id: string): Promise<number> => {
      return this.del(`score/${id}`)
    },
    self: (): Promise<TopScore[]> => {
      return this.get(`score/self`)
    },
    topScores: (): Promise<TopScore[]> => {
      return this.get(`score/top-scores`)
    }
  }
}

async function makeRequest(
  path: string,
  method: Method,
  token: string,
  baseUrl: string,
  body: Record<string, any> = {}
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }

  if (method === "post" || method === "put") {
    options.body = JSON.stringify(body)
  }

  const result = await fetch(`${baseUrl}/${path}`, options)
  if (result.status !== 200) return Promise.reject(result.json())
  return result.json()
}
