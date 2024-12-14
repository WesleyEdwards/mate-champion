import express from "express"
import dotenv from "dotenv"
import {MateServer} from "../../src/server"
import {mockDatabase} from "./mockDb"

export const getMockApp = () => {
  const mockApp = express()

  dotenv.config({path: `.env.mock`})

  mockApp.use(express.json())

  new MateServer({
    db: mockDatabase,
    email: {
      send: () => Promise.reject("Test has not been set up for emails")
    }
  }).generateEndpoints(mockApp)

  return mockApp
}

export type AppType = ReturnType<typeof express>
