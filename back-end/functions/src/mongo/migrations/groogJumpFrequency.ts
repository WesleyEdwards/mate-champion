import {z} from "zod"
import {coors} from "../../types"
import {MigrationFun} from "../mongoMigrations"

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

type OldLevelMap = z.infer<typeof oldLevelMap>
export const groogJumpFrequency: MigrationFun = async (db) => {
  // const levelCollection = db.collection("levelMap")

  // for (const levelRaw of allLevels) {
  //   const level = levelRaw as any
  //   console.log("Fixing ", levelRaw._id)
  //   await levelCollection.updateOne(
  //     {_id: level._id as any},
  //     {
  //       $set: {
  //         groog: level.opponents.grog.map((g) => ({
  //           position: g.position,
  //           moveSpeed: 0.3,
  //           timeBetweenJump: 2000,
  //           timeBetweenTurn: 3000
  //         }))
  //       } satisfies Partial<NewLevelMap>
  //     }
  //   )
  // }
}
export const groogJumpFrequencyCleanup: MigrationFun = async (db) => {
  console.log("About to begin")
  const levelCollection = db.collection("levelMap")
  console.log("levelColl")

  const allLevels = await levelCollection.find({}).toArray()

  console.log("all levels", allLevels.length)
  for (const levelRaw of allLevels) {
    const level: OldLevelMap = levelRaw as any
    console.log("Fixing ", levelRaw._id)
    await levelCollection.updateOne(
      {_id: (level as any)._id as any},
      {
        $unset: {
          opponents: ""
        }
      }
    )
  }
}
