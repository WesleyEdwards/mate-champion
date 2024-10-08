import {controller} from "../auth/controller"
import {modifyLevelMap, getLevelMap, generateLevels} from "./levelMapQueries"

export const levelMapController = controller("level-map", [
  {path: "/:id", method: "get", endpointBuilder: getLevelMap},
  {path: "/:id", method: "put", endpointBuilder: modifyLevelMap},
  {path: "/generate", method: "post", endpointBuilder: generateLevels}
])
