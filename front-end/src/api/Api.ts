import {LevelInfo, LevelMap} from "./serverModels"
import {
  User,
  LoginBody,
  Condition,
  Score,
  TopScore,
  LoginResponse,
  CreateAccount
} from "./types"

export interface Api {
  type: "cache" | "server" | "unauth"
  readonly auth: {
    createAccount: (body: CreateAccount) => Promise<{identifier: string}>
    signIn: (body: LoginBody) => Promise<LoginResponse>
    sendAuthCode: (body: {email: string}) => Promise<{identifier: string}>
    submitAuthCode: (body: {
      email: string
      code: string
    }) => Promise<LoginResponse>
    getSelf: () => Promise<User>
  }

  readonly user: {
    detail: (id: string) => Promise<User>
    query: (filter: Condition<User>) => Promise<User[]>
    create: (body: User) => Promise<User>
    modify: (id: string, mod: Partial<User>) => Promise<User>
    delete: (id: string) => Promise<User>
  }
  readonly level: {
    detail: (id: string) => Promise<LevelInfo>
    query: (filter: Condition<LevelInfo>) => Promise<LevelInfo[]>
    create: (body: LevelInfo) => Promise<LevelInfo>
    modify: (id: string, mod: Partial<LevelInfo>) => Promise<LevelInfo>
    delete: (id: string) => Promise<number>
    generate: (ids: string[]) => Promise<LevelInfo[]>
    levelMapDetail: (id: string) => Promise<LevelMap>
    modifyMap: (id: string, mod: Partial<LevelMap>) => Promise<LevelMap>
    importMap: (importInfo: {
      toImport: {
        level: LevelInfo
        map: LevelMap
      }[]
    }) => Promise<number>
  }
  readonly score: {
    detail: (id: string) => Promise<Score>
    query: (filter: Condition<Score>) => Promise<Score[]>
    create: (body: Score) => Promise<Score>
    update: (id: string, body: Partial<Score>) => Promise<Score>
    delete: (id: string) => Promise<number>
    self: () => Promise<TopScore[]>
    topScores: () => Promise<TopScore[]>
  }
}
