import {controller} from "../auth/controller"
import {
  modifyLevel,
  createLevel,
  getLevel,
  queryLevel,
  queryPartialLevel,
  deleteLevel
} from "./levelQueries"

export const levelsController = controller("level", [
  {path: "/create", method: "post", endpointBuilder: createLevel},
  {path: "/:id", method: "get", endpointBuilder: getLevel},
  {path: "/query", method: "post", endpointBuilder: queryLevel},
  {path: "/query-partial", method: "post", endpointBuilder: queryPartialLevel},
  {path: "/:id", method: "put", endpointBuilder: modifyLevel},
  {path: "/:id", method: "delete", endpointBuilder: deleteLevel}
])
