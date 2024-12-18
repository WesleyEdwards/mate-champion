import {LevelInfo, LevelMap} from "./serverModels"
import {User, LoginBody, Condition, Score} from "./types"
import {Api} from "./Api"

export class ApiCache implements Api {
  private cache: Record<string, Promise<any> | undefined> = {}
  type = "cache" as const

  constructor(private basedOn: Api) {}

  cacheRequest<T>(key: string, promiseFactory: () => Promise<T>) {
    const cached = this.cache[key]
    if (cached) {
      return cached
    }
    this.cache[key] = promiseFactory()
    return this.cache[key]!
  }

  private async withEviction<T>(promise: Promise<T>) {
    this.cache = {}
    return promise
  }

  private async andUpdate<T>(
    key: string,
    queryKey: string,
    promise: Promise<T>
  ) {
    this.cache[key] = promise

    for (const [k, v] of Object.entries(this.cache)) {
      if (k.includes(queryKey)) {
        this.cache[k] = undefined
      }
    }
    return promise
  }

  readonly auth: Api["auth"] = {
    createAccount: (body) => this.basedOn.auth.createAccount(body),
    signIn: (body) => this.basedOn.auth.signIn(body),
    sendAuthCode: (body) => this.basedOn.auth.sendAuthCode(body),
    submitAuthCode: (body) => this.basedOn.auth.submitAuthCode(body),
    getSelf: () => this.cacheRequest("auth.getSelf", this.basedOn.auth.getSelf)
  }

  readonly user = {
    detail: (id: string) =>
      this.cacheRequest(`user.detail.${id}`, () =>
        this.basedOn.user.detail(id)
      ),
    query: (filter: Condition<User>) =>
      this.cacheRequest(`user.query.${JSON.stringify(filter)}`, () =>
        this.basedOn.user.query(filter)
      ),
    create: (body: User) => this.basedOn.user.create(body),
    modify: (id: string, mod: Partial<User>) =>
      this.basedOn.user.modify(id, mod),
    delete: (id: string) => this.withEviction(this.basedOn.user.delete(id))
  }

  readonly level: Api["level"] = {
    detail: (id: string) =>
      this.cacheRequest(`level.detail.${id}`, () =>
        this.basedOn.level.detail(id)
      ),
    query: (filter) =>
      this.cacheRequest(`level.query.${JSON.stringify(filter)}`, () =>
        this.basedOn.level.query(filter)
      ),
    create: (body) => this.basedOn.level.create(body),
    modify: (id, mod) => this.withEviction(this.basedOn.level.modify(id, mod)),
    delete: (id) => this.withEviction(this.basedOn.level.delete(id)),
    generate: (ids) =>
      this.cacheRequest(`level.generate.${ids.join()}`, () =>
        this.basedOn.level.generate(ids)
      ),
    levelMapDetail: (id: string) =>
      this.cacheRequest(`levelMapDetail.${id}`, () =>
        this.basedOn.level.levelMapDetail(id)
      ),
    modifyMap: (id: string, mod: Partial<LevelMap>) =>
      this.withEviction(this.basedOn.level.modifyMap(id, mod)),
    importMap: (importInfo) => this.basedOn.level.importMap(importInfo)
  }

  readonly score = {
    detail: (id: string) =>
      this.cacheRequest(`score.detail.${id}`, () =>
        this.basedOn.score.detail(id)
      ),
    query: (filter: Condition<Score>) =>
      this.cacheRequest(`score.query.${JSON.stringify(filter)}`, () =>
        this.basedOn.score.query(filter)
      ),
    create: (body: Score) => this.basedOn.score.create(body),
    update: (id: string, body: Partial<Score>) =>
      this.basedOn.score.update(id, body),
    delete: (id: string) => this.basedOn.score.delete(id),
    self: () => this.cacheRequest(`score.self`, this.basedOn.score.self),
    topScores: () =>
      this.cacheRequest(`score.topScores`, this.basedOn.score.topScores)
  }
}
