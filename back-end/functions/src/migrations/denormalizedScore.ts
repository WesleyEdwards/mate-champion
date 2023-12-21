import {DbClient} from "../DbClient"

export async function runDenormalizedScore(dbClient: DbClient) {
  console.log("Running denormalizedScore migration")
  const users = await dbClient.user.findMany({})
  const scores = await dbClient.score.findMany({})

  const userScores = users.map((user) => {
    const userScores = scores.filter((score) => score.userId === user._id)
    const highScore = userScores.reduce((acc, score) => {
      return acc > score.score ? acc : score.score
    }, 0)
    return {
      ...user,
      highScore: highScore
    }
  })

  await Promise.all(
    userScores.map(async (user) => {
      await dbClient.user.updateOne(user._id, {highScore: user.highScore})
    })
  )

  return true
}
