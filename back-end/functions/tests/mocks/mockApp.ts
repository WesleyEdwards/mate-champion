import express from "express"
import {Clients} from "../../src/simpleServer/appClients"
import dotenv from "dotenv"
import {mockDatabase} from "./mockDb"
import {applyControllers} from "../../src/controllers/appControllers"

export const getMockApp = () => {
  const mockApp = express()

  dotenv.config({path: `.env.mock`})

  mockApp.use(express.json())

  const mockClients: Clients = {
    db: mockDatabase,
    email: {
      send: () => Promise.reject("Test has not been set up for emails")
    }
  }

  applyControllers(mockApp, mockClients)
  return mockApp
}

export type AppType = ReturnType<typeof express>
