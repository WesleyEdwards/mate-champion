import express from "express"
import cookieParser from "cookie-parser"
import * as functions from "firebase-functions"
import cors from "cors"
import {MateServer} from "./server"
import {settings} from "./settings"
import {mongoClient} from "./mongo/mongoClient"
import {emailClient} from "./email/emailClient"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

const server = new MateServer({
  db: mongoClient(settings.mongoUri, "mate-db"),
  email: emailClient(settings.emailProvider ?? "local", settings.emailKey)
})

server.generateEndpoints(app)

export const api = functions.https.onRequest(app)
