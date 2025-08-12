import express from "express"
import dotenv from "dotenv"
import {mockDatabase} from "./mockDb"
import {createMateServer} from "../../src/server"

export const getMockApp = () => {
  const mockApp = express()

  dotenv.config({path: `.env.mock`})

  mockApp.use(express.json())

  createMateServer(mockApp, {
    db: mockDatabase,
    email: {
      send: () => Promise.reject("Test has not been set up for emails")
    }
  })

  return mockApp
}

export type AppType = ReturnType<typeof express>
