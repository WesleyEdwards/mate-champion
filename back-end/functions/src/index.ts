import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import * as functions from "firebase-functions"
import cors from "cors"
import {DbClient} from "./DbClient"
import {usersController} from "./user/user_controller"
import {scoresController} from "./score/scoresController"
import {mongoClient} from "./mongo/mongoClient"
import {levelsController} from "./levelInfo/level_controller"
import {levelMapController} from "./levelMap/level_map_controller"

dotenv.config({path: `.env.${process.env.NODE_ENV || "prod"}`})

const dbPath = process.env.MONGO_URI!

console.log("NODE_ENV is", process.env.NODE_ENV)

const client: DbClient = mongoClient(dbPath)

const app = express()
app.use(express.json()) // middleware to convert everything to json
app.use(cookieParser())
app.use(cors())

usersController(app, client)
levelsController(app, client)
levelMapController(app, client)
scoresController(app, client)

app.get("/situate", async (_, res) => {
  try {
    await client.runMigrations()
    res.send("Migrations have ran successfully")
  } catch {
    res.status(500).send("Error running migration")
  }
})

app.get("/", (_, res) => {
  res.send("Welcome to mate-champion!")
})

export const api = functions.https.onRequest(app)
