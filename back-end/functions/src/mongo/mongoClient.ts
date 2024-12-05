import {
  Collection,
  Db,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId
} from "mongodb"
import {DbQueries, HasId} from "../DbClient"
import {LevelMap} from "../types"
import {runMigrations} from "./mongoMigrations"
import {DbClient} from "../appClients"
import {Condition, conditionToFilter} from "../condition"
import {User} from "../user/user_controller"
import {LevelInfo} from "../levelInfo/level_controller"
import {Score} from "../score/scoresController"
import {AuthCode} from "../user/auth_controller"

export const mongoClient = (dbPath: string): DbClient => {
  const mClient: MongoClient = new MongoClient(dbPath)
  const db = mClient.db("mate-db")

  return {
    user: functionsForModel<User>(db, "user"),
    score: functionsForModel<Score>(db, "score"),
    level: functionsForModel<LevelInfo>(db, "level"),
    levelMap: functionsForModel<LevelMap>(db, "levelMap"),
    authCode: functionsForModel<AuthCode>(db, "authCode"),
    runMigrations: () => runMigrations(db)
  }
}

function functionsForModel<T extends HasId>(
  db: Db,
  model: string
): DbQueries<T> {
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
      return {error: "unable to find Item"}
    },
    findMany: async (filter: Condition<T>) => {
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
        throw new Error("unable to updateOne. Item not found")
      }
      return value as T
    },
    deleteOne: async (id, condition) => {
      const c: Filter<T> = condition
        ? conditionToFilter({
            and: [{_id: {equal: id}}, condition]
          } as Condition<T>)
        : conditionToFilter({_id: {equal: id}} as Condition<T>)

      const item = await collection.findOneAndDelete(c)
      if (!item) {
        throw new Error("Item not found")
      }
      return item as T
    }
  }
}
