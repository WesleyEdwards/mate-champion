import {
  Collection,
  Db,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId
} from "mongodb"
import {BasicEndpoints, Condition, DbClient, HasId} from "../DbClient"
import {Score, User} from "../types"

function conditionToFilter<T extends HasId>(
  condition: Condition<T>
): Filter<T> {
  const filter: Filter<T> = {}
  for (const key in condition) {
    if (condition[key as keyof T]) {
      if (Array.isArray(condition[key as keyof T])) {
        filter[key as keyof Filter<T>] = {
          $in: condition[key as keyof T]
        }
      } else {
        filter[key as keyof Filter<T>] = condition[key as keyof T]
      }
    }
  }
  return filter
}

export const mongoClient = (): DbClient => {
  const mClient: MongoClient = new MongoClient(process.env.MONGO_URI!)
  const db = mClient.db("reptile-tracker-test")

  return {
    user: functionsForModel<User>(db, "user"),
    score: functionsForModel<Score>(db, "score")
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
      const item = (await collection.findOne(
        conditionToFilter(filter)
      )) as T | null
      if (item) {
        return item
      }
      return undefined
    },
    findMany: async (filter: Condition<T>) => {
      const items = collection.find(conditionToFilter(filter))
      return (await items.toArray()) as T[]
    },
    updateOne: async (id, item) => {
      const value = await collection.findOneAndUpdate({_id: id} as Filter<T>, {
        $set: item
      })
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
