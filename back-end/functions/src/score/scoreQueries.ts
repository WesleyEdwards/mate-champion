import {buildMCQuery} from "../controllers/serverBuilders"
import {User} from "../user/user_controller"
import {Score} from "./scoresController"

export const getTopScores = buildMCQuery({
  fun: async ({res, db}) => {
    const scores = await db.score.findMany({})
    
    const userIds = [...new Set(scores.map((score) => score.userId))]
    const queryUsers = await db.user.findMany({_id: {Inside: userIds}})

    const usersAndScores = scores.reduce<{user: User; score: Score}[]>(
      (acc, score) => {
        const user = queryUsers.find((user) => user._id === score.userId)!
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

    const ordered = usersAndScores.sort((a, b) => b.score.score - a.score.score)
    const info = ordered
      .map((userAndScore) => ({
        name: userAndScore.user.name,
        score: userAndScore.score.score
      }))
      .splice(0, 15)

    return res.json(info)
  }
})
