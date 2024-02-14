import {controller} from "../auth/controller"
import {
  modifyLevel,
  createLevel,
  getLevel,
  queryLevel,
  deleteLevel,
  generateLevels
} from "./levelQueries"

export const levelsController = controller("level", [
  {path: "/create", method: "post", endpointBuilder: createLevel},
  {path: "/generate", method: "post", endpointBuilder: generateLevels},
  {path: "/:id", method: "get", endpointBuilder: getLevel},
  {path: "/query", method: "post", endpointBuilder: queryLevel},
  {path: "/:id", method: "put", endpointBuilder: modifyLevel},
  {path: "/:id", method: "delete", endpointBuilder: deleteLevel}
])
