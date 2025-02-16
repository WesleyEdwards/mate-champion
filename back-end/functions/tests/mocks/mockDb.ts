import {LocalCollection} from "simply-served"
import {DbClient} from "../../src/controllers/appClients"
import {mockAuthCodes} from "./authCodes"
import {mockUserList} from "./users"
import {LevelInfo} from "../../src/levelInfo/level_controller"
import {LevelMap} from "../../src/levelMap/levelMapQueries"
import {Score} from "../../src/score/scoresController"

export const mockDatabase: DbClient = {
  authCode: new LocalCollection(mockAuthCodes),
  level: new LocalCollection<LevelInfo>([]),
  levelMap: new LocalCollection<LevelMap>([]),
  score: new LocalCollection<Score>([]),
  user: new LocalCollection(mockUserList),
  runMigrations: async () => Promise.reject()
}
