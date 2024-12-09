import {controller} from "../controllers/controller"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {createBasicEndpoints} from "../simpleServer/requestBuilders"
import {createDbObject} from "../simpleServer/validation"
import {Infer} from "../types"
import {getTopScores} from "./scoreQueries"

export const scoreSchema = createDbObject((z) =>
  z.object({
    userId: z.string({required_error: "User Id required"}),
    score: z.number({required_error: "Score required"})
  })
)

export type Score = Infer<typeof scoreSchema>

const basicEndpoints = createBasicEndpoints<Score>({
  endpoint: (db) => db.score,
  validator: scoreSchema,
  builder: {
    get: {skipAuth: true},
    query: {skipAuth: true},
    create: {},
    modify: {},
    del: {}
  },
  perms: {
    read: () => ({always: true}),
    delete: ifNotAdmin<Score>((jwtBody) => {
      return {userId: {equal: jwtBody?.userId ?? ""}}
    }),
    create: ifNotAdmin<Score>((jwtBody) => {
      return {userId: {equal: jwtBody?.userId ?? ""}}
    }),
    modify: ifNotAdmin<Score>((jwtBody) => {
      return {userId: {equal: jwtBody?.userId ?? ""}}
    })
  }
})

export const scoresController = controller("score", [
  ...basicEndpoints,
  {
    path: "/top-scores",
    method: "get",
    endpointBuilder: getTopScores,
    skipAuth: true
  }
])
