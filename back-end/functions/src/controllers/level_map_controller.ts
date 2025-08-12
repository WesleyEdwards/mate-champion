import {MServerCtx} from "../appClients"
import {
  baseObjectSchema,
  buildRoute,
  Condition,
  NotFoundError
} from "simply-served"
import {createSchema} from "../helpers"
import {LevelInfo} from "./level_controller"
import {z} from "zod"
import {coors, Infer} from "../types"

export type LevelMap = Infer<typeof levelMapSchema>
export const levelMapSchema = z.object({
  ...baseObjectSchema.shape,
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

export const levelMapController = {
  levelById: buildRoute<MServerCtx>("get")
    .idPath("/:levelId")
    .withAuth()
    .build(async ({db}, res, auth, {levelId}) => {
      const level = await db.level.findOne({_id: {Equal: levelId}})
      if (
        level.owner !== auth.userId &&
        auth.userType !== "Admin" &&
        !level.public
      ) {
        return res.status(404).json("Cant access")
      }
      const levelMap = await db.levelMap.findOne({_id: {Equal: levelId}})
      return res.json(levelMap)
    }),
  byId: buildRoute<MServerCtx>("put")
    .idPath("/:id")
    .withAuth()
    .withBody({validator: levelMapSchema.partial()})
    .build(async ({body, db}, res, auth, {id}) => {
      const condition: Condition<LevelInfo> =
        auth.userType === "Admin"
          ? {_id: {Equal: id}}
          : {And: [{_id: {Equal: id}}, {owner: {Equal: auth.userId}}]}
      const level = await db.level.findOne(condition)
      if (!level) {
        throw new NotFoundError("Level not found")
      }
      const updatedLevel = await db.levelMap.updateOne(id, body)

      return res.json(updatedLevel)
    }),
  generateLevels: buildRoute<MServerCtx>("post")
    .path("/generate")
    .withAuth()
    .withBody({
      validator: createSchema((z) =>
        z.object({
          levels: z.array(z.string())
        })
      )
    })
    .build(async ({body, db}, res) => {
      const levelIds = body.levels
      const levels = await db.levelMap.findMany({
        condition: {_id: {Inside: levelIds}}
      })

      return res.json(
        levels.sort((a, b) => levelIds.indexOf(a._id) - levelIds.indexOf(b._id))
      )
    })
}
