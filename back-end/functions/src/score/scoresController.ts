import {MServerCtx} from "../controllers/appClients"
import {modelRestEndpoints, Route} from "simply-served"
import {Infer} from "../types"
import {getTopScores} from "./scoreQueries"
import {createDbObject, permsIfNotAdmin} from "../helpers"

export const scoreSchema = createDbObject((z) =>
  z.object({
    userId: z.string({required_error: "User Id required"}),
    score: z.number({required_error: "Score required"})
  })
)

export type Score = Infer<typeof scoreSchema>

const basicEndpoints = modelRestEndpoints({
  collection: (db) => db.score,
  validator: scoreSchema,
  actions: {
    postCreate: async (score, {db}) => {
      const high = await db.score.findMany({userId: {Equal: score.userId}})
      await db.user.updateOne(score.userId, {
        highScore: Math.max(...high.map((h) => h.score))
      })
    }
  },
  permissions: permsIfNotAdmin<Score>({
    read: {type: "publicAccess"},
    delete: {
      type: "modelAuth",
      check: (auth) => ({userId: {Equal: auth.userId}})
    },
    create: {
      type: "modelAuth",
      check: (auth) => ({userId: {Equal: auth.userId}})
    },
    modify: {
      type: "modelAuth",
      check: (auth) => ({userId: {Equal: auth.userId}})
    }
  })
})

export const scoresController: Route<MServerCtx>[] = [
  {
    path: "/top-scores",
    method: "get",
    endpointBuilder: getTopScores
  },
  ...basicEndpoints
]
