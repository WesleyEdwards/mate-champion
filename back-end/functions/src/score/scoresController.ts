import {controller} from "../auth/controller"
import {
  createScore,
  deleteScore,
  getMine,
  getTopScores,
  queryScores
} from "./scoreQueries"

export const scoresController = controller("score", [
  {
    path: "/create",
    method: "post",
    endpointBuilder: createScore
  },
  {path: "/", method: "get", endpointBuilder: getMine},
  {path: "/:id", method: "delete", endpointBuilder: deleteScore},
  {path: "/query", method: "post", endpointBuilder: queryScores},
  {
    path: "/top-scores",
    method: "get",
    endpointBuilder: getTopScores,
    skipAuth: true
  }
])
