import {middleware} from "./auth/middleware"
import {Clients, EmailClient} from "./controllers/appClients"
import {authController} from "./user/auth_controller"
import {usersController} from "./user/user_controller"
import {levelsController} from "./levelInfo/level_controller"
import {levelMapController} from "./levelMap/level_map_controller"
import {scoresController} from "./score/scoresController"
import {ExpressType, SimplyServer} from "./simpleServer/server/simpleServer"

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
