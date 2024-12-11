import {
  createBasicMCEndpoints,
  mcController
} from "../controllers/serverBuilders"
import {ifNotAdmin} from "../levelInfo/level_controller"
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

const basicEndpoints = createBasicMCEndpoints({
  endpoint: (db) => db.score,
  validator: scoreSchema,
  skipAuth: {
    get: true,
    query: true
  },
  permissions: {
    read: () => ({Always: true}),
    delete: ifNotAdmin<Score>((auth) => {
      return {userId: {Equal: auth.jwtBody?.userId ?? ""}}
    }),
    create: ifNotAdmin<Score>((auth) => {
      return {userId: {Equal: auth.jwtBody?.userId ?? ""}}
    }),
    modify: ifNotAdmin<Score>((auth) => {
      return {userId: {Equal: auth.jwtBody?.userId ?? ""}}
    })
  }
})

export const scoresController = mcController("score", [
  ...basicEndpoints,
  {
    path: "/top-scores",
    method: "get",
    endpointBuilder: getTopScores,
    skipAuth: true
  }
])
