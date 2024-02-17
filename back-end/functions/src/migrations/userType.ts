import {DbClient} from "../DbClient"

export async function userType(client: DbClient) {
  const users = await client.user.findMany({})
  const withEnumType = users.map((user) => ({
    ...user,
    type: user.admin ? "Admin" : "User"
  }))
  withEnumType.forEach(async (user) => {
    await client.user.updateOne(user._id, user)
  })

  withEnumType.forEach(async (user) => {
    await client.user.updateOne(user._id, user)
  })

  return true
}
