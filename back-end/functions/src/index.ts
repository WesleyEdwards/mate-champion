import express from "express"
import cookieParser from "cookie-parser"
import * as functions from "firebase-functions"
import cors from "cors"
import {settings} from "./settings"
import {mongoClient} from "./mongo/mongoClient"
import {emailClient} from "./email/emailClient"
import { createMateServer } from "./server"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

const server = createMateServer({
  db: mongoClient(settings.mongoUri, "mate-db"),
  email: emailClient(settings.emailProvider ?? "local", settings.emailKey)
})

server.generateEndpoints(app)

export const api = functions.https.onRequest(app)
