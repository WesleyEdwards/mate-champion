import {
  Collection,
  Db,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId
} from "mongodb"
import {BasicEndpoints, Condition, DbClient, HasId} from "../DbClient"
import {LevelInfo, LevelMap, Score, User} from "../types"
import {runMigrations} from "./mongoMigrations"

function conditionToFilter<T>(condition: Condition<T>): Filter<T> {
  const acc: Filter<T> = {}

  if ("equal" in condition) {
    return condition.equal as Filter<T>
  }

  if ("or" in condition) {
    acc.$or = condition.or.map((cond) => conditionToFilter(cond)) as any
    return acc
  }

  if ("and" in condition) {
    acc.$and = condition.and.map((cond) => conditionToFilter(cond)) as any
    return acc
  }

  if ("always" in condition) {
    if (condition.always) {
      return acc
    } else {
      throw new Error("Invalid 'always' condition. It must be true.")
    }
  }

  for (const key in condition) {
    const value = condition[key]

    if (key === "equal" || key === "or" || key === "and" || key === "always") {
      continue
    }

    if (value && typeof value === "object") {
      acc[key as keyof Filter<T>] = conditionToFilter(
        value as Condition<T[typeof key]>
      )
    }
  }

  return acc
}

export const mongoClient = (dbPath: string): DbClient => {
  const mClient: MongoClient = new MongoClient(dbPath)
  const db = mClient.db("mate-db")

  return {
    user: functionsForModel<User>(db, "user"),
    score: functionsForModel<Score>(db, "score"),
    level: functionsForModel<LevelInfo>(db, "level"),
    levelMap: functionsForModel<LevelMap>(db, "levelMap"),
    runMigrations: () => runMigrations(db)
  }
}

function functionsForModel<T extends HasId>(
  db: Db,
  model: string
): BasicEndpoints<T> {
  const collection: Collection<T> = db.collection(model)

  return {
    insertOne: async (newItem: T) => {
      const {acknowledged} = await collection.insertOne(
        newItem as OptionalUnlessRequiredId<T>
      )
      if (acknowledged) {
        return newItem
      }
      return {error: "Unknown error"}
    },
    findOne: async (filter) => {
      const item = (await collection.findOne(
        conditionToFilter(filter)
      )) as T | null
      if (item) {
        return item
      }
      return {error: "Unknown error"}
    },
    findMany: async (filter: Condition<T>) => {
      const items = collection.find(conditionToFilter(filter))
      return (await items.toArray()) as T[]
    },
    queryPartial: async (filter: Condition<T>, fields: string[]) => {
      const items = collection.find(conditionToFilter(filter), {
        projection: fields.reduce((acc, field) => {
          acc[field] = 1
          return acc
        }, {} as Record<string, 1>)
      })
      return (await items.toArray()) as T[]
    },
    updateOne: async (id, item) => {
      const value = await collection.findOneAndUpdate(
        {_id: id} as Filter<T>,
        {$set: item},
        {returnDocument: "after"}
      )
      if (!value) {
        throw new Error("Item not found")
      }
      return value as T
    },
    deleteOne: async (id, condition) => {
      const c: Filter<T> = condition
        ? conditionToFilter({and: [{_id: id}, condition]} as Condition<T>)
        : conditionToFilter({_id: id} as Condition<T>)

      const item = await collection.findOneAndDelete(c)
      if (!item) {
        throw new Error("Item not found")
      }
      return item as T
    }
  }
}
