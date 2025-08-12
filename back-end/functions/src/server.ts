import {MServerCtx} from "./appClients"
import {authController} from "./controllers/auth_controller"
import {usersController} from "./controllers/user_controller"
import {levelsController} from "./controllers/level_controller"
import {levelMapController} from "./controllers/level_map_controller"
import {scoresController} from "./controllers/scoresController"
import {addContext, addController, bearerTokenMiddleware} from "simply-served"
import {RequestWithCtx, WithoutAuth} from "simply-served"
import {Express} from "express"

export const createMateServer = (
  app: Express,
  context: WithoutAuth<MServerCtx>
) => {
  app.use(addContext(context))
  app.use(bearerTokenMiddleware(process.env.ENCRYPTION_KEY!))

  addController<MServerCtx>(app, {path: "/auth", routes: authController})
  addController<MServerCtx>(app, {path: "/user", routes: usersController})
  addController<MServerCtx>(app, {path: "/level", routes: levelsController})
  addController<MServerCtx>(app, {
    path: "/level-map",
    routes: levelMapController
  })

  addController<MServerCtx>(app, {path: "/score", routes: scoresController})

  app.get("/situate", async (req, res) => {
    const db = (req as RequestWithCtx<MServerCtx>).db
    try {
      await db.runMigrations()
      res.send("Migrations have ran successfully")
    } catch {
      res.status(500).send("Error running migration")
    }
  })

  app.get("/", (_, res) => {
    res.send("Welcome to Mate Champion!")
  })
}
