import {
  Collection,
  Db,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId
} from "mongodb"
import {BasicEndpoints, Condition, DbClient, HasId} from "../DbClient"
import {LevelInfo, Score, User} from "../types"
import {runMigrations} from "./mongoMigrations"

function conditionToFilter<T extends HasId>(
  condition: Condition<T>
): Filter<T> {
  // const filter: Filter<T> = {}
  // for (const k in condition) {
  //   const key = k as keyof Condition<T>
  //   if (key === "or") {
  //     const arr = condition[key]
  //     if (!Array.isArray(arr)) {
  //       throw new Error("or condition must be an array")
  //     }
  //     filter.$or = arr.map(conditionToFilter) as any
  //     continue
  //   }
  //   if (condition[key]) {
  //     if (Array.isArray(condition[key])) {
  //       filter[key as keyof Filter<T>] = {
  //         $in: condition[key]
  //       }
  //     } else {
  //       filter[key as keyof Filter<T>] = condition[key]
  //     }
  //   }
  // }
  // return filter

  return Object.entries(condition).reduce((acc, [k, v]) => {
    const key = k as keyof Condition<T>
    if (key === "or") {
      const arr = v
      if (!Array.isArray(arr)) {
        throw new Error("or condition must be an array")
      }
      acc.$or = arr.map(conditionToFilter) as any
      return acc
    }
    if (v) {
      if (Array.isArray(v)) {
        acc[key as keyof Filter<T>] = {
          $in: v
        }
      } else {
        acc[key as keyof Filter<T>] = v
      }
    }
    return acc
  }, {} as Filter<T>)
}

export const mongoClient = (): DbClient => {
  const mClient: MongoClient = new MongoClient(process.env.MONGO_URI!)
  const db = mClient.db("reptile-tracker-test")

  return {
    user: functionsForModel<User>(db, "user"),
    score: functionsForModel<Score>(db, "score"),
    level: functionsForModel<LevelInfo>(db, "level"),
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
      return undefined
    },
    findOne: async (filter) => {
      console.log("CONDITION", conditionToFilter(filter))
      const item = (await collection.findOne(
        conditionToFilter(filter)
      )) as T | null
      if (item) {
        return item
      }
      return undefined
    },
    findMany: async (filter: Condition<T>) => {
      console.log("CONDITION", conditionToFilter(filter))
      const items = collection.find(conditionToFilter(filter))
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
    deleteOne: async (id: string) => {
      const item = await collection.findOneAndDelete({_id: id} as Filter<T>)
      if (!item) {
        throw new Error("Item not found")
      }
      return item._id
    }
  }
}
