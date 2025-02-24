import {LevelInfo} from "./controllers/level_controller"
import {LevelMap} from "./controllers/level_map_controller"
import {Score} from "./controllers/scoresController"
import {JWTBody} from "./types"
import {AuthCode} from "./controllers/auth_controller"
import {User} from "./controllers/user_controller"
import {DbMethods} from "simply-served"

export type DbClient = {
  user: DbMethods<User>
  level: DbMethods<LevelInfo>
  score: DbMethods<Score>
  levelMap: DbMethods<LevelMap>
  authCode: DbMethods<AuthCode>
  runMigrations: () => Promise<unknown>
}

export type EmailClient = {
  send: (params: {
    to: string
    subject: string
    html: string
  }) => Promise<unknown>
}

export type MServerCtx = {db: DbClient; email: EmailClient; auth: JWTBody}
