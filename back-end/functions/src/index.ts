import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import * as functions from "firebase-functions"
import cors from "cors"
import {DbClient} from "./DbClient"
import {usersController} from "./user/user_controller"
import {scoresController} from "./score/scoresController"
import {mongoClient} from "./mongo/mongoClient"
import {runMigrations} from "./migrations/runMigrations"

dotenv.config()

const client: DbClient = mongoClient()

const app = express()
app.use(express.json()) // middleware to convert everything to json
app.use(cookieParser())
app.use(cors())

usersController(app, client)
scoresController(app, client)

app.post("/situate", async (_, res) => {
  await runMigrations(client)
  res.send("Migrations have ran successfully")
})

app.get("/", (_, res) => {
  res.send("Welcome to mate-champion!")
})

export const api = functions.https.onRequest(app)
