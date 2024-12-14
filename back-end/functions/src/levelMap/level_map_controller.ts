import {Clients} from "../controllers/appClients"
import {Route} from "../simpleServer/server/controller"
import {modifyLevelMap, getLevelMap, generateLevels} from "./levelMapQueries"

export const levelMapController: Route<Clients>[] = [
  {path: "/:id", method: "get", endpointBuilder: getLevelMap},
  {path: "/:id", method: "put", endpointBuilder: modifyLevelMap},
  {path: "/generate", method: "post", endpointBuilder: generateLevels}
]
