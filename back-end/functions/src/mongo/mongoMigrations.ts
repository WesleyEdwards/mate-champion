import {Db, Collection} from "mongodb"

export async function runMigrations(db: Db): Promise<boolean> {
  const levelCollection: Collection<any> = db.collection("level")
  const migrationCollection: Collection<any> = db.collection("migrations")

  const migrationName = "addEndPositionField"

  const hasRun = await migrationCollection.findOne({name: migrationName})
  if (hasRun) {
    console.log("Migration has already been run.")
    return true
  }

  const levelsToUpdate = await levelCollection.find({}).toArray()
  console.log("levelsToUpdate", levelsToUpdate)
  for (const level of levelsToUpdate) {
    await levelCollection.updateOne(
      {_id: level._id},
      {
        $set: {endPosition: 4500}
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
