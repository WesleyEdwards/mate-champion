import {ReqBuilder} from "../auth/authTypes"
import {Condition} from "../DbClient"
import {checkPartialValidation, isParseError, isValid} from "../request_body"
import {LevelInfo} from "../types"

export const getLevelMap: ReqBuilder =
  ({db}) =>
  async ({params, jwtBody}, res) => {
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

export const modifyLevelMap: ReqBuilder =
  ({db}) =>
  async ({params, body, jwtBody}, res) => {
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
    const levelMapPartial = checkPartialValidation("levelMap", {
      ...body,
      level: params.id
    })
    if (isParseError(levelMapPartial))
      return res.status(400).json(levelMapPartial)

    const updatedLevel = await db.levelMap.updateOne(params.id, levelMapPartial)

    return res.json(updatedLevel)
  }

export const generateLevels: ReqBuilder =
  ({db}) =>
  async ({body}, res) => {
    const levelIds = body as string[]
    if (!Array.isArray(levelIds)) {
      return res.status(400).json("Please supply a list of ids of levels")
    }
    const levels = await db.levelMap.findMany({_id: {inside: levelIds}})

    return res.json(
      levels.sort((a, b) => levelIds.indexOf(a._id) - levelIds.indexOf(b._id))
    )
  }
