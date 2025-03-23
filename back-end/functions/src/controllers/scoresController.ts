import {MServerCtx} from "../appClients"
import {buildRoute, modelRestEndpoints, Route} from "simply-served"
import {Infer} from "../types"
import {createDbObject, permsIfNotAdmin} from "../helpers"
import {User} from "./user_controller"

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
      const high = await db.score.findMany({
        condition: {userId: {Equal: score.userId}}
      })
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
  buildRoute<MServerCtx>("get")
    .path("/top-scores")
    .build(async ({res, db}) => {
      const scores = await db.score.findMany({})

      const userIds = [...new Set(scores.map((score) => score.userId))]
      const queryUsers = await db.user.findMany({
        condition: {_id: {Inside: userIds}}
      })

      const usersAndScores = scores.reduce<{user: User; score: Score}[]>(
        (acc, score) => {
          const user = queryUsers.find((user) => user._id === score.userId)
          if (!user) return acc

          const exists = acc.find(
            (userAndScore) => userAndScore.user._id === user._id
          )
          if (exists) {
            if (exists.score.score < score.score) {
              exists.score = score
            }
            return acc
          }
          acc.push({user, score})
          return acc
        },
        []
      )

      const ordered = usersAndScores.sort(
        (a, b) => b.score.score - a.score.score
      )
      const info = ordered
        .map((userAndScore) => ({
          name: userAndScore.user.name,
          score: userAndScore.score.score
        }))
        .splice(0, 15)

      return res.json(info)
    }),
  ...basicEndpoints
]
