import {Db, Collection} from "mongodb"
import {z} from "zod"
import {coors} from "../types"
import {
  groogJumpFrequency,
  groogJumpFrequencyCleanup
} from "./migrations/groogJumpFrequency"
import {groogJumpRandomMigration} from "./migrations/groogJumpRandom"
import {groogJumpNoneMigration} from "./migrations/groogJumpNone"

export type MigrationFun = (db: Db) => Promise<unknown>

export async function runMigrations(db: Db): Promise<unknown> {
  // await migrationFun("addLevelMap", db, migrationAddLevelMap)
  // await migrationFun("levelInfoFields2", db, migrationLevelInfoFields)
  // await migrationFun("migrateLevelCoors1", db, migrateLevels)
  await migrationFun("addPlayerInitPos", db, addPlayerInitPos)
  await migrationFun("groogJumpFrequency", db, groogJumpFrequency)
  await migrationFun("groogJumpFrequencyCleanup", db, groogJumpFrequencyCleanup)
  await migrationFun("groogJumpRandomMigration", db, groogJumpRandomMigration)
  await migrationFun("groogJumpNoneMigration", db, groogJumpNoneMigration)
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
  try {
    await fun(db)
    await migrationCollection.insertOne({name})
    console.log(`Migration ${name} completed`)
  } catch (e) {
    console.log(`Migration ${name} failed`, e)
  }
  return true
}

const oldLevelMap = z.object({
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
  platformColor: z.string().default("springgreen"),
  platforms: z
    .object({
      dimensions: coors,
      position: coors,
      color: z.string().nullable().default(null)
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

const newLevelMap = z.object({
  champInitPos: coors.default([400, 400]),
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
  platformColor: z.string().default("springgreen"),
  platforms: z
    .object({
      dimensions: coors,
      position: coors,
      color: z.string().nullable().default(null)
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
type OldLevelMap = z.infer<typeof oldLevelMap>
type NewLevelMap = z.infer<typeof newLevelMap>

const addPlayerInitPos: MigrationFun = async (db) => {
  const levelCollection = db.collection("levelMap")

  const allLevels = await levelCollection.find({}).toArray()

  for (const levelRaw of allLevels) {
    const level: OldLevelMap = levelRaw as any
    await levelCollection.updateOne(
      {_id: (level as any)._id as any},
      {
        $set: {
          champInitPos: [400, 400]
        } satisfies Partial<NewLevelMap>
      }
    )
  }
}

// type OldLevelMap = z.infer<any>
// type NewLevelMap = z.infer<any>

// const migrateLevels: MigrationFun = async (db) => {
//   const levelCollection = db.collection("levelMap")

//   const allLevels = await levelCollection.find({}).toArray()

//   for (const levelRaw of allLevels) {
//     const level: OldLevelMap = levelRaw as any
//     await levelCollection.updateOne(
//       {_id: level._id as any},
//       {
//         $set: {
//           packages: level.packages.map((o) => [o.x, o.y]),
//           platforms: level.platforms.map((p) => {
//             return {
//               color: p.color,
//               dimensions: [p.width, p.height],
//               position: [p.x, p.y]
//             }
//           }),
//           opponents: {
//             grog: level.opponents.grog.map((old) => {
//               const {initPos, ...rest} = old
//               return {...rest, position: initPos}
//             })
//           }
//         } satisfies Partial<NewLevelMap>
//       }
//     )
//   }
// }
