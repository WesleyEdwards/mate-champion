import {LevelInfo, LevelMap} from "../game/loopShared/models"
import {objectsAreDifferent} from "../helpers"
import {User, LoginBody, Condition, Score} from "../types"
import {Api} from "./Api"

export class LocalApi implements Api {
  type = "cache" as const

  constructor(private basedOn: Api) {}

  local: {myLevels: LevelInfo[]; maps: LevelMap[]} = {
    myLevels: [],
    maps: []
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
      const level = this.local.myLevels.find((l) => l._id === id)
      if (level) return Promise.resolve(level)
      return Promise.reject("Not found")
    },
    query: () => {
      return Promise.resolve(this.local.myLevels)
    },
    create: (level) => {
      this.local.myLevels.push(level)
      this.local.maps.push({
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
      this.local.myLevels = this.local.myLevels.map((c) => {
        if (c._id === id) {
          return {...c, mod}
        }
        return c
      })
      console.log({...this.local})
      return this.level.detail(id)
    },
    delete: (id) => {
      this.local.myLevels = this.local.myLevels.filter((l) => {
        return l._id !== id
      })
      return Promise.resolve(1)
    },
    generate: (...args) => this.basedOn.level.generate(...args),
    levelMapDetail: (id) => {
      const map = this.local.maps.find((l) => l._id === id)
      if (map) return Promise.resolve(map)
      return Promise.reject("Not found")
    },
    modifyMap: (id, mod) => {
      this.local.maps = this.local.maps.map((c) => {
        if (c._id === id) {
          return {...c, ...mod}
        }
        return c
      })
      console.log("map", {...this.local})
      return this.level.levelMapDetail(id)
    }
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
