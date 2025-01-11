import {DbClient} from "../../src/controllers/appClients"
import {Condition} from "simply-served"
import {DbQueries, HasId, MaybeError} from "simply-served"
import {LevelInfo} from "../../src/levelInfo/level_controller"
import {Score} from "../../src/score/scoresController"
import {mockAuthCodes} from "./authCodes"
import {mockUserList} from "./users"
import {LevelMap} from "../../src/levelMap/levelMapQueries"
import {evalCondition} from "simply-served"

export class DataStore<T extends HasId> {
  constructor(private items: T[]) {}
  insertOne = async (item: T) => {
    this.items.push(item)
    return {success: true, data: item} as const
  }
  findOne = async (filter: Condition<T>): Promise<MaybeError<T>> => {
    const filtered = this.items.filter((item) => evalCondition(item, filter))

    const res = filtered.at(0)
    if (res) {
      return {success: true, data: res}
    }
    return {
      success: false,
      error: "Not found"
    }
  }
  findMany = async (filter: Condition<T>): Promise<T[]> => {
    const filtered = this.items.filter((item) => evalCondition(item, filter))
    return filtered
  }
  updateOne = async (
    id: string,
    update: Partial<T>
  ): Promise<MaybeError<T>> => {
    const old = this.items.find((i) => i._id === id)
    if (!old) return {success: false, error: "Not found"}
    const copy = {...old}
    this.items = [...this.items.map((item) => ({...item, ...update}))]
    return {success: true, data: copy}
  }
  deleteOne = async (
    id: string,
    condition?: Condition<T> | undefined
  ): Promise<T> => {
    const old = this.items.find((i) => i._id === id)
    this.items = [...this.items.filter((i) => i._id !== id)]
    if (!old) throw new Error("Not found")
    return old
  }
}

export const mockStore = <T extends HasId>(items: T[]): DbQueries<T> => {
  return new DataStore(items)
}

export const mockDatabase: DbClient = {
  authCode: mockStore(mockAuthCodes),
  level: mockStore<LevelInfo>([]),
  levelMap: mockStore<LevelMap>([]),
  score: mockStore<Score>([]),
  user: mockStore(mockUserList),
  runMigrations: async () => Promise.reject()
}
