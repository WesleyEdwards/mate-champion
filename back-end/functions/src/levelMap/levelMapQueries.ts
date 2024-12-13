import {Condition} from "../simpleServer/condition/condition"
import {LevelInfo} from "../levelInfo/level_controller"
import {coors, Infer} from "../types"
import {
  checkPartialValidation,
  createDbObject,
  createSchema,
  isParseError
} from "../simpleServer/validation"
import {buildMCQuery} from "../controllers/serverBuilders"

export type LevelMap = Infer<typeof levelMapSchema>
export const levelMapSchema = createDbObject((z) =>
  z.object({
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
        width: z.number(),
        color: z.string()
      })
      .array()
      .default([])
  })
)

export const getLevelMap = buildMCQuery({
  fun: async ({req, res, db, auth}) => {
    const {params} = req
    if (!params.id || typeof params.id !== "string") {
      return res.status(400).json("Bad request")
    }
    const level = await db.level.findOne({_id: {Equal: params.id}})
    if (!level.success) return res.status(404).json("Not found")
    if (
      level.data.owner !== auth?.userId &&
      auth?.userType !== "Admin" &&
      !level.data.public
    ) {
      return res.status(404).json("Cant access")
    }
    const levelMap = await db.levelMap.findOne({_id: {Equal: params.id}})
    return res.json(levelMap)
  }
})

export const modifyLevelMap = buildMCQuery({
  validator: levelMapSchema.partial(),
  fun: async ({req, res, db, auth}) => {
    const {params, body} = req
    const condition: Condition<LevelInfo> =
      auth?.userType === "Admin"
        ? {_id: {Equal: params.id}}
        : {
            And: [
              {_id: {Equal: params.id}},
              {owner: {Equal: auth?.userId ?? ""}}
            ]
          }
    const level = await db.level.findOne(condition)
    if (isParseError(level)) {
      return res.status(404).json("Level map not found")
    }
    const levelMapPartial = checkPartialValidation(
      {
        ...body,
        level: params.id
      },
      levelMapSchema
    )
    if (isParseError(levelMapPartial))
      return res.status(400).json(levelMapPartial)

    const updatedLevel = await db.levelMap.updateOne(params.id, levelMapPartial)

    return res.json(updatedLevel)
  }
})

export const generateLevels = buildMCQuery({
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
