import request from "supertest"
import express from "express"
import {Clients} from "../appClients"
import dotenv from "dotenv"
import {mockDatabase} from "./mocks/mockDb"
import {applyControllers} from "../controllers/appControllers"
import {authTests} from "./auth"
import {securityTests} from "./security"

const mockApp = express()

dotenv.config({path: `.env.mock`})

mockApp.use(express.json())

const mockClients: Clients = {
  db: mockDatabase,
  email: {
    send: () => Promise.reject()
  }
}

applyControllers(mockApp, mockClients)

mockApp.get("/start", (_, res) => {
  res.json("Welcome to mate-champion!")
})

describe(`GET /`, () => {
  it("Should be Welcome", async () => {
    const response = await request(mockApp).get(`/start`)
    expect(response.status).toBe(200)
    expect(response.body).toBe("Welcome to mate-champion!")
  })
})

type AppType = ReturnType<typeof express>
export type LocalTests = (app: AppType) => void

securityTests(mockApp)
authTests(mockApp)
