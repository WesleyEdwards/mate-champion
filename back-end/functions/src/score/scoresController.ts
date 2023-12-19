import {controller} from "../auth/controller"
import {createScore, getMine, queryScores} from "./scoreQueries"

export const scoresController = controller("user", [
  {
    path: "/create",
    method: "post",
    endpointBuilder: createScore
  },
  {path: "/", method: "get", endpointBuilder: getMine},
  {path: "/", method: "post", endpointBuilder: queryScores}
])
