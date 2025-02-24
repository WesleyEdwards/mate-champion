import {LocalCollection} from "simply-served"
import {DbClient} from "../../src/appClients"
import {mockAuthCodes} from "./authCodes"
import {mockUserList} from "./users"
import {LevelInfo} from "../../src/controllers/level_controller"
import {Score} from "../../src/controllers/scoresController"
import {LevelMap} from "../../src/controllers/level_map_controller"

export const mockDatabase: DbClient = {
  authCode: new LocalCollection(mockAuthCodes),
  level: new LocalCollection<LevelInfo>([]),
  levelMap: new LocalCollection<LevelMap>([]),
  score: new LocalCollection<Score>([]),
  user: new LocalCollection(mockUserList),
  runMigrations: async () => Promise.reject()
}
