import {Clients} from "./appClients"
import express from "express"
import {levelsController} from "../levelInfo/level_controller"
import {levelMapController} from "../levelMap/level_map_controller"
import {scoresController} from "../score/scoresController"
import {usersController} from "../user/user_controller"
import {authController} from "../user/auth_controller"
import {middleware} from "../auth/middleware"

export const applyControllers = (
  app: ReturnType<typeof express>,
  clients: Omit<Clients, "auth">
) => {
  authController(app, middleware(clients))
  usersController(app, middleware(clients))
  levelsController(app, middleware(clients))
  levelMapController(app, middleware(clients))
  scoresController(app, middleware(clients))
  return app
}
