import {DbQueries} from "./DbClient"
import {AuthCode, LevelInfo, LevelMap, Score, User} from "./types"

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
