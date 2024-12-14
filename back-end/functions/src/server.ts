import {middleware} from "./auth/middleware"
import express from "express"
import {Clients, EmailClient} from "./controllers/appClients"
import {controller, Route, SInfo} from "./simpleServer/server/controller"
import {authController} from "./user/auth_controller"
import {usersController} from "./user/user_controller"
import {levelsController} from "./levelInfo/level_controller"
import {levelMapController} from "./levelMap/level_map_controller"
import {scoresController} from "./score/scoresController"

type ExpressType = ReturnType<typeof express>

abstract class SimplyServer<C extends SInfo> {
  abstract db: C["db"]
  controllers: {[K in string]: Route<C>[]} = {}

  middleware: (req: express.Request, skipAuth?: boolean) => C | null = () =>
    null

  endpoints: (app: ExpressType) => ExpressType = (a) => a

  generateEndpoints = (app: ExpressType) => {
    for (const [path, routes] of Object.entries(this.controllers)) {
      controller(path, routes)(app, this.middleware)
    }
    this.endpoints(app)
    return app
  }
}

export class MateServer extends SimplyServer<Clients> {
  db: Clients["db"]
  email: Clients["email"]
  constructor(params: {db: Clients["db"]; email: EmailClient}) {
    super()
    this.db = params.db
    this.email = params.email
    this.middleware = middleware({db: this.db, email: this.email})
  }

  controllers = {
    auth: authController,
    user: usersController,
    level: levelsController,
    "level-map": levelMapController,
    score: scoresController
  }

  endpoints = (app: ExpressType) => {
    app.get("/situate", async (_, res) => {
      try {
        await this.db.runMigrations()
        res.send("Migrations have ran successfully")
      } catch {
        res.status(500).send("Error running migration")
      }
    })

    app.get("/", (_, res) => {
      res.send("Welcome to mate-champion!")
    })
    return app
  }
}
