import {LevelInfo, LevelMap, Score, User} from "./types"

export type HasId = {
  _id: string
}

export type Condition<T extends HasId> =
  | {[P in keyof T]?: T[P][] | T[P]}
  | {or?: Condition<T>[]}
  
export function queryContainsKey(query: any, key: string): boolean {
  return Object.entries(query).some(([k, v]) => {
    if (k === key) return true
    if (Array.isArray(v)) {
      const isString = typeof v.at(0) === "string"
      return isString
        ? v.includes(key)
        : v.some((q) => queryContainsKey(q, key))
    }
    if (k === "or") {
      return queryContainsKey(v, key)
    }
    return false
  })
}

export type OrError<T> = T | undefined

export type BasicEndpoints<T extends HasId> = {
  insertOne: (item: T) => Promise<OrError<T>>
  findOne: (filter: Condition<T>) => Promise<OrError<T>>
  findMany: (filter: Condition<T>) => Promise<T[]>
  queryPartial: (
    filter: Condition<T>,
    fields: string[]
  ) => Promise<Partial<T>[]>
  updateOne: (id: string, update: Partial<T>) => Promise<OrError<T>>
  deleteOne: (id: string) => Promise<string>
}

export type DbClient = {
  user: BasicEndpoints<User>
  level: BasicEndpoints<LevelInfo>
  score: BasicEndpoints<Score>
  levelMap: BasicEndpoints<LevelMap>
  runMigrations: () => Promise<unknown>
}
