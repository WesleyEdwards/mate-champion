import {LevelInfo, LevelMap, Score, User} from "./types"

export type HasId = {
  _id: string
}

export declare type Condition<T> =
  | {equal: T}
  | {inside: T[]}
  | {or: Array<Condition<T>>}
  | {and: Array<Condition<T>>}
  | {always: true}
  | (keyof T extends never ? never : {[P in keyof T]?: Condition<T[P]>})

export declare type Modification<T> = {assign: T}

// function isValidQuery<T>(q: any): q is Condition<T> {
//   if (typeof q === "object") {
//     for (const key in q) {
//       if ()
//     }

//   }
//   return true
// }

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
