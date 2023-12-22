import {DbClient} from "../DbClient"

export async function adminField(client: DbClient) {
  const users = await client.user.findMany({})
  const usersWithAdmin = users.map((user) => {
    if (user.email === "wesley@example.com") {
      return {...user, admin: true}
    }
    return {...user, admin: false}
  })
  usersWithAdmin.forEach(async (user) => {
    await client.user.updateOne(user._id, user)
  })
  return true
}
