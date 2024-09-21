import {controller} from "../auth/controller"
import {
  createScore,
  deleteScore,
  getMine,
  getTopScores,
  queryScores
} from "./scoreQueries"

export const scoresController = controller("score", (db) => [
  {
    path: "/create",
    method: "post",
    endpointBuilder: createScore(db)
  },
  {path: "/self", method: "get", endpointBuilder: getMine(db)},
  {path: "/:id", method: "delete", endpointBuilder: deleteScore(db)},
  {path: "/query", method: "post", endpointBuilder: queryScores(db)},
  {
    path: "/top-scores",
    method: "get",
    endpointBuilder: getTopScores(db),
    skipAuth: true
  }
])
