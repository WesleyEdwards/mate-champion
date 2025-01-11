import {modelDbQueries} from "simply-served"
import {runMigrations} from "./mongoMigrations"
import {DbClient} from "../controllers/appClients"
import {MongoClient} from "mongodb"

export const mongoClient = (mongoUri: string, dbPath: string): DbClient => {
  const mClient: MongoClient = new MongoClient(mongoUri)
  const db = mClient.db(dbPath)

  return {
    user: modelDbQueries(db, "user"),
    score: modelDbQueries(db, "score"),
    level: modelDbQueries(db, "level"),
    levelMap: modelDbQueries(db, "levelMap"),
    authCode: modelDbQueries(db, "authCode"),
    runMigrations: () => runMigrations(db)
  }
}
