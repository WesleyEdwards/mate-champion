import {DbQueries} from "./DbClient"
import {LevelInfo, LevelMap, Score, User} from "./types"

export type EmailClient = {}

export type DbClient = {
  user: DbQueries<User>
  level: DbQueries<LevelInfo>
  score: DbQueries<Score>
  levelMap: DbQueries<LevelMap>
  runMigrations: () => Promise<unknown>
}

export type Clients = {db: DbClient; email: EmailClient}
