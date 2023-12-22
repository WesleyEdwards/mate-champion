import {ReqBuilder} from "../auth/authTypes"
import {checkValidation, isParseError} from "../request_body"
import {Score, User} from "../types"

export const createScore: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    console.log("user", jwtBody!.userId)
    const scoreBody = checkValidation("score", {
      ...body,
      userId: jwtBody!.userId
    })
    if (isParseError(scoreBody)) return res.status(400).json(scoreBody)

    const user = await client.user.findOne({_id: jwtBody!.userId})

    if (!user) return res.status(400).json("User does not exist")
    if (scoreBody.score > user.highScore) {
      await client.user.updateOne(user._id, {highScore: scoreBody.score})
    }

    const score = await client.score.insertOne(scoreBody)
    if (!score) return res.json("Error creating score")

    return res.json(score)
  }

export const queryScores: ReqBuilder =
  (client) =>
  async ({body}, res) => {
    const scores = await client.score.findMany({})
    return res.json(scores)
  }

export const getMine: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    const scores = await client.score.findMany({userId: jwtBody!.userId})
    return res.json(scores)
  }

export const deleteScore: ReqBuilder =
  (client) =>
  async ({params}, res) => {
    const score = await client.score.deleteOne(params.id)
    return res.json(score)
  }

export const getTopScores: ReqBuilder = (client) => async (_, res) => {
  const scores: Score[] = await client.score.findMany({})

  const userIds = [...new Set(scores.map((score) => score.userId))]
  const queryUsers: User[] = await client.user.findMany({_id: userIds})

  const usersAndScores = scores.reduce((acc, score) => {
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
  }, [] as {user: User; score: Score}[])

  const ordered = usersAndScores.sort((a, b) => b.score.score - a.score.score)
  const info = ordered
    .map((userAndScore) => ({
      name: userAndScore.user.name,
      score: userAndScore.score.score
    }))
    .splice(0, 15)

  return res.json(info)
}
