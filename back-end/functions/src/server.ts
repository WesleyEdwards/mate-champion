import {MServerCtx} from "./controllers/appClients"
import {authController} from "./user/auth_controller"
import {usersController} from "./user/user_controller"
import {levelsController} from "./levelInfo/level_controller"
import {levelMapController} from "./levelMap/level_map_controller"
import {scoresController} from "./score/scoresController"
import {createSimplyServer, verifyAuth} from "simply-served"
import {WithoutAuth} from "simply-served/build/endpoints/types"

export const createMateServer = (context: WithoutAuth<MServerCtx>) =>
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
    beforeGenerateEndpoints: (app, ctx) => {
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
