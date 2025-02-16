import {LevelInfo} from "../levelInfo/level_controller"
import {LevelMap} from "../levelMap/levelMapQueries"
import {Score} from "../score/scoresController"
import {JWTBody} from "../types"
import {AuthCode} from "../user/auth_controller"
import {User} from "../user/user_controller"
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
