import {Clients} from "../appClients"
import express from "express"
import {levelsController} from "../levelInfo/level_controller"
import {levelMapController} from "../levelMap/level_map_controller"
import {scoresController} from "../score/scoresController"
import {authController} from "../user/auth_controller"
import {usersController} from "../user/user_controller"

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
