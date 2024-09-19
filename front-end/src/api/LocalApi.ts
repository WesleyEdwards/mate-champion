import {MyLevels} from "../components/MyLevels"
import {LevelInfo, LevelMap} from "../game/loopShared/models"
import {Api} from "./Api"
import {LocalStorageKeys} from "./localStorageManager"

export class StoreItem<T> {
  constructor(private key: LocalStorageKeys) {}
  get items(): T[] {
    const items = localStorage.getItem(this.key) ?? "[]"
    console.log("Items to unparse", items)
    return JSON.parse(items)
  }
  set items(items: T[]) {
    localStorage.setItem(this.key, JSON.stringify(items))
  }

  add(item: T) {
    const i = this.items
    i.push(item)
    this.items = i
  }
}

export class LocalApi implements Api {
  type = "cache" as const

  constructor(private basedOn: Api) {}

  local = {
    myLevels: new StoreItem<LevelInfo>("unauth-level-info"),
    myMaps: new StoreItem<LevelMap>("unauth-level-map")
  }

  readonly auth: Api["auth"] = {
    createAccount: (...args) => this.basedOn.auth.createAccount(...args),
    signIn: (...args) => this.basedOn.auth.signIn(...args),
    getSelf: () => this.basedOn.auth.getSelf()
  }

  readonly user: Api["user"] = {
    detail: (...args) => this.basedOn.user.detail(...args),
    query: (...args) => this.basedOn.user.query(...args),
    create: (...args) => this.basedOn.user.create(...args),
    modify: (...args) => this.basedOn.user.modify(...args),
    delete: (...args) => this.basedOn.user.delete(...args)
  }

  readonly level: Api["level"] = {
    detail: (id) => {
      const level = this.local.myLevels.items.find((l) => l._id === id)
      if (level) return Promise.resolve(level)
      return Promise.reject("Not found")
    },
    query: () => {
      return Promise.resolve(this.local.myLevels.items)
    },
    create: (level) => {
      this.local.myLevels.add(level)
      this.local.myMaps.add({
        _id: level._id,
        endPosition: 4500,
        packages: [],
        opponents: {grog: []},
        floors: [{x: -500, width: 7000, color: "green"}],
        platforms: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return Promise.resolve(level)
    },
    modify: async (id, mod) => {
      this.local.myLevels.items = this.local.myLevels.items.map((c) => {
        if (c._id === id) {
          return {...c, mod}
        }
        return c
      })
      return this.level.detail(id)
    },
    delete: (id) => {
      this.local.myLevels.items = this.local.myLevels.items.filter((l) => {
        return l._id !== id
      })
      return Promise.resolve(1)
    },
    generate: (...args) => this.basedOn.level.generate(...args),
    levelMapDetail: (id) => {
      const map = this.local.myMaps.items.find((l) => l._id === id)
      if (map) return Promise.resolve(map)
      return Promise.reject("Not found")
    },
    modifyMap: (id, mod) => {
      this.local.myMaps.items = this.local.myMaps.items.map((c) => {
        if (c._id === id) {
          return {...c, ...mod}
        }
        return c
      })
      return this.level.levelMapDetail(id)
    },
    importMap: (...args) => this.basedOn.level.importMap(...args)
  }

  readonly score: Api["score"] = {
    detail: (...args) => this.basedOn.score.detail(...args),
    query: (...args) => this.basedOn.score.query(...args),
    create: (...args) => this.basedOn.score.create(...args),
    update: (...args) => this.basedOn.score.update(...args),
    delete: (...args) => this.basedOn.score.delete(...args),
    self: (...args) => this.basedOn.score.self(...args),
    topScores: (...args) => this.basedOn.score.topScores(...args)
  }
}
