import {z} from "zod"
import {coors} from "../../types"
import {MigrationFun} from "../mongoMigrations"
import {baseObjectSchema} from "simply-served"

const oldLevelMapSchema = z
  .object({
    champInitPos: coors.default([400, 400]),
    packages: coors.array().default([]),
    endPosition: z.number().default(4500),
    groog: z
      .object({
        position: coors,
        moveSpeed: z.number(),
        timeBetweenJump: z.number().optional().default(2000),
        timeBetweenTurn: z.number().optional().default(3000)
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

export const groogJumpRandomMigration: MigrationFun = async (db) => {
  const levelCollection = db.collection("levelMap")

  const levels = await levelCollection.find().toArray()

  for (const level of levels) {
    const updatedGroog = (
      level as unknown as z.infer<typeof oldLevelMapSchema>
    ).groog.map((groog) => {
      const {timeBetweenJump, timeBetweenTurn, ...rest} = groog

      return {
        ...rest,
        timeBetweenJump: {
          time: typeof timeBetweenJump === "number" ? timeBetweenJump : 2000,
          random: false
        },
        timeBetweenTurn: {
          time: typeof timeBetweenTurn === "number" ? timeBetweenTurn : 3000,
          random: false
        }
      }
    })

    await levelCollection.updateOne(
      {_id: level._id},
      {
        $set: {
          groog: updatedGroog
        }
      }
    )
  }
}
