import {z} from "zod"
import {coors} from "../../types"
import {MigrationFun} from "../mongoMigrations"
import {baseObjectSchema} from "simply-served"

const oldLevelMap = z
  .object({
    champInitPos: coors.default([400, 400]),
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    groog: z
      .object({
        position: coors,
        moveSpeed: z.number(),
        timeBetweenJump: z.object({
          time: z.number().default(2000),
          type: z.enum(["None", "Time", "Random"]).default("Time")
        }),
        timeBetweenTurn: z.object({
          time: z.number().default(3000),
          type: z.enum(["None", "Time", "Random"]).default("Time")
        })
      })
      .array()
      .default([]),
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
        width: z.number()
      })
      .array()
      .default([])
  })
  .merge(baseObjectSchema)

const newLevelMap = z
  .object({
    champInitPos: coors.default([400, 400]),
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    groog: z
      .object({
        position: coors,
        moveSpeed: z.number().gte(0).default(0.3),
        facingRight: z.boolean().default(true),
        timeBetweenJump: z.object({
          time: z.number().default(2000),
          type: z.enum(["None", "Time", "Random"]).default("Time")
        }),
        timeBetweenTurn: z.object({
          time: z.number().default(3000),
          type: z.enum(["None", "Time", "Random"]).default("Time")
        })
      })
      .array()
      .default([]),
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
        width: z.number()
      })
      .array()
      .default([])
  })
  .merge(baseObjectSchema)

type OldLevelMap = z.infer<typeof oldLevelMap>
type NewLevelMap = z.infer<typeof newLevelMap>
export const groogFacing: MigrationFun = async (db) => {
  const levelCollection = db.collection("levelMap")

  const allLevels = await levelCollection.find({}).toArray()

  for (const levelRaw of allLevels) {
    const level: OldLevelMap = levelRaw as any
    const newGroogs: NewLevelMap["groog"] = level.groog.map((g) => {
      const c: NewLevelMap["groog"][number] = {
        position: g.position,
        facingRight: g.moveSpeed >= 0,
        moveSpeed: Math.max(g.moveSpeed, -g.moveSpeed),
        timeBetweenJump: g.timeBetweenJump,
        timeBetweenTurn: g.timeBetweenTurn
      }
      return c
    })
    await levelCollection.updateOne(
      {_id: (level as any)._id as any},
      {
        $set: {
          groog: newGroogs
        }
      }
    )
  }
}
