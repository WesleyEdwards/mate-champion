import {mcController} from "../controllers/serverBuilders"
import {modifyLevelMap, getLevelMap, generateLevels} from "./levelMapQueries"

export const levelMapController = mcController("level-map", [
  {path: "/:id", method: "get", endpointBuilder: getLevelMap},
  {path: "/:id", method: "put", endpointBuilder: modifyLevelMap},
  {path: "/generate", method: "post", endpointBuilder: generateLevels}
])
