import {buildQuery} from "../auth/authTypes"
import {Condition} from "../condition"
import {LevelInfo} from "../levelInfo/level_controller"
import {checkPartialValidation, isParseError, isValid} from "../request_body"
import {createSchema, levelMapSchema} from "../types"

export const getLevelMap = buildQuery({
  fun: async ({req, res, db}) => {
    const {params, jwtBody} = req
    if (!params.id || typeof params.id !== "string") {
      return res.status(400).json("Bad request")
    }
    const level = await db.level.findOne({_id: {equal: params.id}})
    if (!isValid<LevelInfo>(level)) return res.status(404).json("Not found")
    if (
      level.owner !== jwtBody?.userId &&
      jwtBody?.userType !== "Admin" &&
      !level.public
    ) {
      return res.status(404).json("Cant access")
    }
    const levelMap = await db.levelMap.findOne({_id: {equal: params.id}})
    return res.json(levelMap)
  }
})

export const modifyLevelMap = buildQuery({
  validator: levelMapSchema.partial(),
  fun: async ({req, res, db}) => {
    const {jwtBody, params, body} = req
    const condition: Condition<LevelInfo> =
      jwtBody?.userType === "Admin"
        ? {_id: {equal: params.id}}
        : {
            and: [
              {_id: {equal: params.id}},
              {owner: {equal: jwtBody?.userId ?? ""}}
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

export const generateLevels = buildQuery({
  validator: createSchema((z) =>
    z.object({
      levels: z.array(z.string())
    })
  ),
  fun: async ({req, res, db}) => {
    const levelIds = req.body.levels
    const levels = await db.levelMap.findMany({_id: {inside: levelIds}})

    return res.json(
      levels.sort((a, b) => levelIds.indexOf(a._id) - levelIds.indexOf(b._id))
    )
  }
})
