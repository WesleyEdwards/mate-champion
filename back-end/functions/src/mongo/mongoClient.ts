import {mongoQueries} from "simply-served"
import {runMigrations} from "./mongoMigrations"
import {DbClient} from "../controllers/appClients"
import {MongoClient} from "mongodb"

export const mongoClient = (mongoUri: string, dbPath: string): DbClient => {
  const mClient: MongoClient = new MongoClient(mongoUri)
  const db = mClient.db(dbPath)

  return {
    user: mongoQueries(db, "user"),
    score: mongoQueries(db, "score"),
    level: mongoQueries(db, "level"),
    levelMap: mongoQueries(db, "levelMap"),
    authCode: mongoQueries(db, "authCode"),
    runMigrations: () => runMigrations(db)
  }
}
