import {DbClient} from "../../appClients"
import {Condition, evalCondition} from "../../condition"
import {DbQueries, HasId, OrError} from "../../DbClient"
import {LevelInfo} from "../../levelInfo/level_controller"
import {Score} from "../../score/scoresController"
import {LevelMap} from "../../types"
import {mockAuthCodes} from "./authCodes"
import {mockUserList} from "./users"

export class DataStore<T extends HasId> {
  constructor(private items: T[]) {}
  insertOne = async (item: T) => {
    this.items.push(item)
    return item
  }
  findOne = async (filter: Condition<T>): Promise<OrError<T>> => {
    const filtered = this.items.filter((item) => evalCondition(item, filter))
    const res: OrError<T> = filtered.at(0) ?? {error: "Not found"}
    return res
  }
  findMany = async (filter: Condition<T>): Promise<T[]> => {
    const filtered = this.items.filter((item) => evalCondition(item, filter))
    return filtered
  }
  updateOne = (id: string, update: Partial<T>): Promise<OrError<T>> => {
    throw new Error("Function not implemented.")
  }
  deleteOne = (
    id: string,
    condition?: Condition<T> | undefined
  ): Promise<T> => {
    throw new Error("Function not implemented.")
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
