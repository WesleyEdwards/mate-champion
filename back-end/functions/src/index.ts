import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import * as functions from "firebase-functions"
import cors from "cors"
import {mongoClient} from "./mongo/mongoClient"
import {emailClient} from "./email/emailClient"
import {Clients} from "./appClients"
import {applyControllers} from "./controllers/appControllers"

dotenv.config({path: `.env.${process.env.NODE_ENV || "prod"}`})

const dbPath = process.env.MONGO_URI!
const emailOption = process.env.EMAIL
const emailKey = process.env.SENDGRID_API_KEY

console.log("NODE_ENV is", process.env.NODE_ENV)

const clients: Clients = {
  db: mongoClient(dbPath),
  email: emailClient(emailOption ?? "local", emailKey)
}
const app = express()

app.use(express.json()) // middleware to convert everything to json
app.use(cookieParser())
app.use(cors())

applyControllers(app, clients)

app.get("/situate", async (_, res) => {
  try {
    await clients.db.runMigrations()
    res.send("Migrations have ran successfully")
  } catch {
    res.status(500).send("Error running migration")
  }
})

app.get("/", (_, res) => {
  res.send("Welcome to mate-champion!")
})

export const api = functions.https.onRequest(app)
