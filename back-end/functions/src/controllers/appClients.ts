import {LevelInfo} from "../levelInfo/level_controller"
import {LevelMap} from "../levelMap/levelMapQueries"
import {Score} from "../score/scoresController"
import {AuthCode} from "../user/auth_controller"
import {User} from "../user/user_controller"
import {DbQueries} from "simply-served"
import {JWTBody} from "../auth/middleware"

export type DbClient = {
  user: DbQueries<User>
  level: DbQueries<LevelInfo>
  score: DbQueries<Score>
  levelMap: DbQueries<LevelMap>
  authCode: DbQueries<AuthCode>
  runMigrations: () => Promise<unknown>
}

export type EmailClient = {
  send: (params: {
    to: string
    subject: string
    html: string
  }) => Promise<unknown>
}

export type MServerCtx = {db: DbClient; email: EmailClient; auth?: JWTBody}
