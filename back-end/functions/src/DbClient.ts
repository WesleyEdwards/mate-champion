import {LevelInfo, LevelMap, Score, User} from "./types"

export type HasId = {
  _id: string
}

export declare type Condition<T> =
  | {equal: T}
  | {assign: T}
  | {inside: T[]}
  | {or: Array<Condition<T>>}
  | {and: Array<Condition<T>>}
  | {always: true}
  | (T extends object ? { [P in keyof T]?: Condition<T[P]> } : never)
  // | (keyof T extends never ? never : {[P in keyof T]?: Condition<T[P]>})

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

export type OrError<T> = T | {error: string}

export type BasicEndpoints<T extends HasId> = {
  insertOne: (item: T) => Promise<OrError<T>>
  findOne: (filter: Condition<T>) => Promise<OrError<T>>
  findMany: (filter: Condition<T>) => Promise<T[]>
  queryPartial: (
    filter: Condition<T>,
    fields: string[]
  ) => Promise<Partial<T>[]>
  updateOne: (id: string, update: Partial<T>) => Promise<OrError<T>>
  deleteOne: (id: string, condition?: Condition<T>) => Promise<T>
}

export type DbClient = {
  user: BasicEndpoints<User>
  level: BasicEndpoints<LevelInfo>
  score: BasicEndpoints<Score>
  levelMap: BasicEndpoints<LevelMap>
  runMigrations: () => Promise<unknown>
}
