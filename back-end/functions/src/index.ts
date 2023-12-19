import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import * as functions from "firebase-functions"
import cors from "cors"
import {DbClient} from "./DbClient"
import {usersController} from "./user/user_controller"
import {scoresController} from "./score/scoresController"
import {mongoClient} from "./mongo/mongoClient"

dotenv.config()

const client: DbClient = mongoClient()

const app = express()
app.use(express.json()) // middleware to convert everything to json
app.use(cookieParser())
app.use(cors())

usersController(app, client)
scoresController(app, client)

app.get("/", (_, res) => {
  res.send("Welcome to mate-champion!")
})

export const api = functions.https.onRequest(app)
