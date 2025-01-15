import {MServerCtx} from "./controllers/appClients"
import {authController} from "./user/auth_controller"
import {usersController} from "./user/user_controller"
import {levelsController} from "./levelInfo/level_controller"
import {levelMapController} from "./levelMap/level_map_controller"
import {scoresController} from "./score/scoresController"
import {ExpressType, createSimplyServer, verifyAuth} from "simply-served"

export const createMateServer = (context: MServerCtx) =>
  createSimplyServer({
    initContext: context,
    middleware: verifyAuth(process.env.ENCRYPTION_KEY!),
    controllers: {
      auth: authController,
      user: usersController,
      level: levelsController,
      "level-map": levelMapController,
      score: scoresController
    },
    beforeGenerateEndpoints: (app: ExpressType, ctx) => {
      app.get("/situate", async (_, res) => {
        try {
          await ctx.db.runMigrations()
          res.send("Migrations have ran successfully")
        } catch {
          res.status(500).send("Error running migration")
        }
      })

      app.get("/", (_, res) => {
        res.send("Welcome to mate-champion!")
      })
    }
  })
