import {LevelInfo, LevelMap} from "../game/loopShared/models"
import {objectsAreDifferent} from "../helpers"
import {User, LoginBody, Condition, Score} from "../types"
import {Api} from "./Api"

export class ApiCache implements Api {
  private cache: Record<string, Promise<any> | undefined> = {}

  private prevMap: LevelMap | null = null

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

  readonly auth = {
    createAccount: (body: User & {password: string; score?: number}) =>
      this.basedOn.auth.createAccount(body),
    signIn: (body: LoginBody) => this.basedOn.auth.signIn(body),
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

  readonly level = {
    detail: (id: string) =>
      this.cacheRequest(`level.detail.${id}`, () =>
        this.basedOn.level.detail(id)
      ),
    query: (filter: Condition<LevelInfo>) =>
      this.cacheRequest(`level.query.${JSON.stringify(filter)}`, () =>
        this.basedOn.level.query(filter)
      ),
    create: (body: LevelInfo) => this.basedOn.level.create(body),
    modify: (id: string, mod: Partial<LevelInfo>) =>
      this.withEviction(this.basedOn.level.modify(id, mod)),
    delete: (id: string) => this.withEviction(this.basedOn.level.delete(id)),
    generate: (ids: string[]) =>
      this.cacheRequest(`level.generate.${ids.join()}`, () =>
        this.basedOn.level.generate(ids)
      ),
    levelMapDetail: (id: string) =>
      this.cacheRequest(`levelMapDetail.${id}`, () =>
        this.basedOn.level.levelMapDetail(id)
      ),
    modifyMap: (id: string, mod: Partial<LevelMap>) =>
      this.withEviction(this.basedOn.level.modifyMap(id, mod))
    // modifyMap: (id: string, mod: Partial<LevelMap>) => {
    //   if (this.prevMap === null) {
    //     return this.withEviction(
    //       this.basedOn.level.modifyMap(id, mod).then((res) => {
    //         this.prevMap = res
    //         return res
    //       })
    //     )
    //   }
    //   const diff = Object.entries(mod).some(([modKey, modVal]) => {
    //     return objectsAreDifferent(modVal, this.prevMap![modKey])
    //   })
    //   if (diff) {
    //     return this.withEviction(this.basedOn.level.modifyMap(id, mod))
    //   } else {
    //     return Promise.resolve(this.prevMap!)
    //   }
    // }
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
