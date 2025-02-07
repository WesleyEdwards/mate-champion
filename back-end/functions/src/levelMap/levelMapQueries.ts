import {buildQuery, Condition} from "simply-served"
import {LevelInfo} from "../levelInfo/level_controller"
import {coors, Infer} from "../types"
import {baseObjectSchema, isParseError} from "simply-served"
import {z} from "zod"
import {createSchema} from "../helpers"
import {MServerCtx, requireAuth} from "../controllers/appClients"

export type LevelMap = Infer<typeof levelMapSchema>

export const levelMapSchema = z
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

export const getLevelMap = buildQuery<MServerCtx>({
  authOptions: requireAuth,
  fun: async ({req, res, db, auth}) => {
    const {params} = req
    if (!params.id || typeof params.id !== "string") {
      return res.status(400).json("Bad request")
    }
    const level = await db.level.findOne({_id: {Equal: params.id}})
    if (!level.success) return res.status(404).json("Not found")
    if (
      level.data.owner !== auth.userId &&
      auth.userType !== "Admin" &&
      !level.data.public
    ) {
      return res.status(404).json("Cant access")
    }
    const levelMap = await db.levelMap.findOne({_id: {Equal: params.id}})
    if (levelMap.success === false) {
      return res.status(400).json(levelMap.error)
    }
    return res.json(levelMap.data)
  }
})

export const modifyLevelMap = buildQuery<MServerCtx, Partial<LevelMap>>({
  validator: levelMapSchema.partial(),
  authOptions: requireAuth,
  fun: async ({req, res, db, auth}) => {
    const {params, body} = req
    const condition: Condition<LevelInfo> =
      auth.userType === "Admin"
        ? {_id: {Equal: params.id}}
        : {And: [{_id: {Equal: params.id}}, {owner: {Equal: auth.userId}}]}
    const level = await db.level.findOne(condition)
    if (isParseError(level)) {
      return res.status(404).json("Level map not found")
    }

    const updatedLevel = await db.levelMap.updateOne(params.id, body)
    if (updatedLevel.success === false) {
      return res.status(400).json(updatedLevel.error)
    }

    return res.json(updatedLevel.data)
  }
})

export const generateLevels = buildQuery<MServerCtx>({
  authOptions: requireAuth,
  validator: createSchema((z) =>
    z.object({
      levels: z.array(z.string())
    })
  ),
  fun: async ({req, res, db}) => {
    const levelIds = req.body.levels
    const levels = await db.levelMap.findMany({_id: {Inside: levelIds}})

    return res.json(
      levels.sort((a, b) => levelIds.indexOf(a._id) - levelIds.indexOf(b._id))
    )
  }
})
