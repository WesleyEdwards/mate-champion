import {Db, Collection} from "mongodb"
import {z} from "zod"
import {baseObjectSchema, coordinates, coors} from "../types"

type MigrationFun = (db: Db) => Promise<unknown>

export async function runMigrations(db: Db): Promise<unknown> {
  await migrationFun("addLevelMap", db, migrationAddLevelMap)
  await migrationFun("levelInfoFields2", db, migrationLevelInfoFields)
  await migrationFun("migrateLevelCoors1", db, migrateLevels)
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

const oldLevelMapSchema = z
  .object({
    packages: coordinates.array().default([]),
    endPosition: z.number().default(4500),
    opponents: z
      .object({
        grog: z
          .object({
            initPos: coors,
            moveSpeed: z.number(),
            jumpOften: z.boolean().optional().default(false)
          })
          .array()
      })
      .default({grog: []}),
    platforms: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        color: z.string()
      })
      .array()
      .default([]),
    floors: z
      .object({
        x: z.number(),
        width: z.number(),
        color: z.string()
      })
      .array()
      .default([])
  })
  .merge(baseObjectSchema)

const newLevelMapSchema = z
  .object({
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    opponents: z
      .object({
        grog: z
          .object({
            position: coors,
            moveSpeed: z.number(),
            jumpOften: z.boolean().optional().default(false)
          })
          .array()
      })
      .default({grog: []}),
    platforms: z
      .object({
        dimensions: coors,
        position: coors,
        color: z.string()
      })
      .array()
      .default([]),
    floors: z
      .object({
        x: z.number(),
        width: z.number(),
        color: z.string()
      })
      .array()
      .default([])
  })
  .merge(baseObjectSchema)

type OldLevelMap = z.infer<typeof oldLevelMapSchema>
type NewLevelMap = z.infer<typeof newLevelMapSchema>

const migrateLevels: MigrationFun = async (db) => {
  const levelCollection = db.collection("levelMap")

  const allLevels = await levelCollection.find({}).toArray()

  for (const levelRaw of allLevels) {
    const level: OldLevelMap = levelRaw as any
    await levelCollection.updateOne(
      {_id: level._id as any},
      {
        $set: {
          packages: level.packages.map((o) => [o.x, o.y]),
          platforms: level.platforms.map((p) => {
            return {
              color: p.color,
              dimensions: [p.width, p.height],
              position: [p.x, p.y]
            }
          }),
          opponents: {
            grog: level.opponents.grog.map((old) => {
              const {initPos, ...rest} = old
              return {...rest, position: initPos}
            })
          }
        } satisfies Partial<NewLevelMap>
      }
    )
  }
}
