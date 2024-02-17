import {Db, Collection} from "mongodb"

export async function runMigrations(db: Db): Promise<boolean> {
  const migrationCollection: Collection<any> = db.collection("users")
  const userCollection: Collection<any> = db.collection("user")
  const migrationName = "addEditorUserType"

  const hasRun = await migrationCollection.findOne({name: migrationName})
  if (hasRun) {
    console.log("Migration has already been run.")
    return true
  }

  const usersToUpdate = await userCollection.find({}).toArray()
  console.log("usersToUpdate", usersToUpdate)
  for (const user of usersToUpdate) {
    const userType = user.admin ? "Admin" : "User"

    await userCollection.updateOne(
      {_id: user._id},
      {
        $unset: {admin: ""},
        $set: {userType}
      }
    )
  }

  await migrationCollection.insertOne({
    name: migrationName,
    completedAt: new Date()
  })

  console.log("Migration completed successfully.")
  return true
}
