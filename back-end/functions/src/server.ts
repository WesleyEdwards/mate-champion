import {MServerCtx} from "./appClients"
import {authController} from "./controllers/auth_controller"
import {usersController} from "./controllers/user_controller"
import {levelsController} from "./controllers/level_controller"
import {levelMapController} from "./controllers/level_map_controller"
import {scoresController} from "./controllers/scoresController"
import {bearerTokenAuth, createSimplyServer} from "simply-served"
import {WithoutAuth} from "simply-served/build/types"

export const createMateServer = (context: WithoutAuth<MServerCtx>) =>
  createSimplyServer({
    initContext: context,
    getAuth: bearerTokenAuth(process.env.ENCRYPTION_KEY!),
    controllers: [
      {path: "/auth", routes: authController},
      {path: "/user", routes: usersController},
      {path: "/level", routes: levelsController},
      {path: "/level-map", routes: levelMapController},
      {path: "/score", routes: scoresController}
    ],
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
