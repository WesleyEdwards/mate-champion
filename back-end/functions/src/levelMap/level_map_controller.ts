import {controller} from "../auth/controller"
import {modifyLevelMap, getLevelMap, generateLevels} from "./levelMapQueries"

export const levelMapController = controller("level-map", (db) => [
  {path: "/:id", method: "get", endpointBuilder: getLevelMap(db)},
  {path: "/:id", method: "put", endpointBuilder: modifyLevelMap(db)},
  {path: "/generate", method: "post", endpointBuilder: generateLevels(db)}
])
