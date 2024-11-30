import {DbQueries} from "./DbClient"
import {LevelInfo} from "./levelInfo/level_controller"
import {Score} from "./score/scoresController"
import {LevelMap} from "./types"
import {AuthCode} from "./user/auth_controller"
import {User} from "./user/user_controller"

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

export type Clients = {db: DbClient; email: EmailClient}
