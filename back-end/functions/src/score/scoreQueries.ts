import {ReqBuilder} from "../auth/authTypes"
import {checkValidation, isParseError} from "../request_body"

export const createScore: ReqBuilder =
  (client) =>
  async ({body, jwtBody}, res) => {
    const scoreBody = checkValidation("score", {
      ...body,
      user: jwtBody!.userId
    })
    if (isParseError(scoreBody)) return res.status(400).json(scoreBody)

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
