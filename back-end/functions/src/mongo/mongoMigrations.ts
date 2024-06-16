import {Db, Collection} from "mongodb"

type MigrationFun = (db: Db) => Promise<unknown>

export async function runMigrations(db: Db): Promise<unknown> {
  await migrationFun("addLevelMap", db, migrationAddLevelMap)
  await migrationFun("levelInfoFields", db, migrationLevelInfoFields)
  return true
}

const migrationFun = async (
  name: string,
  db: Db,
  fun: MigrationFun
): Promise<unknown> => {
  const migrationCollection: Collection<any> = db.collection("migrations")
  const hasRun = await migrationCollection.findOne({name: name})
  if (hasRun) {
    console.log(`Migration ${name} has already run`)
    return
  }
  console.log(`Running migration ${name}`)
  const result = await fun(db)
  if (result) {
    await migrationCollection.insertOne({name})
    console.log(`Migration ${name} completed`)
    return
  }
  console.log(`Migration ${name} failed`)
  return
}

// Migration functions

const migrationAddLevelMap: MigrationFun = async (db) => {
  const levelMapCollection = db.collection("levelMap")
  const levelCollection = db.collection("level")

  const allLevels = await levelCollection.find({}).toArray()
  for (const level of allLevels) {
    const {packages, endPosition, opponents, platforms, floors, _id} = level
    const newLevel = {packages, endPosition, opponents, platforms, floors, _id}
    await levelMapCollection.insertOne(newLevel)
  }
}

const migrationLevelInfoFields: MigrationFun = async (db) => {
  const levelCollection = db.collection("level")

  const allLevels = await levelCollection.find({}).toArray()

  for (const level of allLevels) {
    await levelCollection.updateOne(
      {_id: level._id},
      {
        $unset: {
          packages: null,
          endPosition: null,
          opponents: null,
          platforms: null,
          floors: null
        }
      }
    )
  }
}
