import {Score, User} from "./types"

export type HasId = {
  _id: string
}

export type Condition<T extends HasId> = {
  [P in keyof T]?: T[P][] | T[P]
}

export type OrError<T> = T | undefined

export type BasicEndpoints<T extends HasId> = {
  insertOne: (item: T) => Promise<OrError<T>>
  findOne: (filter: Condition<T>) => Promise<OrError<T>>
  findMany: (filter: Condition<T>) => Promise<T[]>
  updateOne: (id: string, update: Partial<T>) => Promise<OrError<T>>
  deleteOne: (id: string) => Promise<string>

}

export type DbClient = {
  user: BasicEndpoints<User>
  score: BasicEndpoints<Score>
}
