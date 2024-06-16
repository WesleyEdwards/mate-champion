import {controller} from "../auth/controller"
import {
  modifyLevelMap,
  getLevelMap,
} from "./levelMapQueries"

export const levelMapController = controller("level-map", [
  {path: "/:id", method: "get", endpointBuilder: getLevelMap},
  {path: "/:id", method: "put", endpointBuilder: modifyLevelMap},
])
