import {Clients} from "../controllers/appClients"
import {createBasicMCEndpoints} from "../controllers/serverBuilders"
import {ifNotAdmin} from "../levelInfo/level_controller"
import {Route} from "../simpleServer/server/controller"
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
    delete: ifNotAdmin<Score>(({auth}) => {
      return {userId: {Equal: auth?.userId ?? ""}}
    }),
    create: ifNotAdmin<Score>(({auth}) => {
      return {userId: {Equal: auth?.userId ?? ""}}
    }),
    modify: ifNotAdmin<Score>(({auth}) => {
      return {userId: {Equal: auth?.userId ?? ""}}
    })
  }
})

export const scoresController: Route<Clients>[] = [
  ...basicEndpoints,
  {
    path: "/top-scores",
    method: "get",
    endpointBuilder: getTopScores,
    skipAuth: true
  }
]
