import {Clients} from "../simpleServer/appClients"
import express from "express"
import {levelsController} from "../levelInfo/level_controller"
import {levelMapController} from "../levelMap/level_map_controller"
import {scoresController} from "../score/scoresController"
import {usersController} from "../user/user_controller"
import {authController} from "../user/auth_controller"

export const applyControllers = (
  app: ReturnType<typeof express>,
  clients: Clients
) => {
  authController(app, clients)
  usersController(app, clients)
  levelsController(app, clients)
  levelMapController(app, clients)
  scoresController(app, clients)
  return app
}
